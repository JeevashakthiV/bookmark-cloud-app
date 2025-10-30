const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to extract text from HTML
function extractTextFromHTML(html) {
  const $ = cheerio.load(html);
  
  // Remove script, style, and other non-content tags
  $('script, style, nav, footer, iframe, noscript').remove();
  
  // Get text content
  let text = $('body').text();
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Limit to first 8000 characters to avoid token limits
  return text.substring(0, 8000);
}

// Helper function to get page title
function getPageTitle(html, url) {
  const $ = cheerio.load(html);
  
  // Try different title sources
  let title = $('title').text().trim();
  
  if (!title) {
    title = $('meta[property="og:title"]').attr('content');
  }
  
  if (!title) {
    title = $('h1').first().text().trim();
  }
  
  if (!title) {
    // Use URL as fallback
    try {
      const urlObj = new URL(url);
      title = urlObj.hostname;
    } catch (e) {
      title = 'Untitled Page';
    }
  }
  
  return title;
}

// Helper function to get favicon URL
function getFaviconURL(html, url) {
  const $ = cheerio.load(html);
  
  // Try different favicon sources
  let favicon = $('link[rel="icon"]').attr('href') ||
                $('link[rel="shortcut icon"]').attr('href') ||
                $('link[rel="apple-touch-icon"]').attr('href');
  
  if (favicon) {
    // Make favicon URL absolute
    try {
      const urlObj = new URL(url);
      if (favicon.startsWith('//')) {
        favicon = urlObj.protocol + favicon;
      } else if (favicon.startsWith('/')) {
        favicon = urlObj.origin + favicon;
      } else if (!favicon.startsWith('http')) {
        favicon = urlObj.origin + '/' + favicon;
      }
    } catch (e) {
      // If URL parsing fails, use Google's favicon service
      try {
        const urlObj = new URL(url);
        favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
      } catch (e2) {
        favicon = null;
      }
    }
  } else {
    // Use Google's favicon service as fallback
    try {
      const urlObj = new URL(url);
      favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch (e) {
      favicon = null;
    }
  }
  
  return favicon;
}

// API endpoint to summarize a webpage
app.post('/api/summarize', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Validate URL format
    let validUrl;
    try {
      validUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }
    
    console.log(`Fetching content from: ${url}`);
    
    // Fetch the webpage
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = response.data;
    
    // Extract title and favicon
    const title = getPageTitle(html, url);
    const favicon = getFaviconURL(html, url);
    
    // Extract and clean text content
    const textContent = extractTextFromHTML(html);
    
    if (!textContent || textContent.length < 50) {
      return res.status(400).json({ 
        error: 'Unable to extract meaningful content from the webpage',
        title,
        favicon
      });
    }
    
    console.log('Generating AI summary...');
    
    // Generate summary using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Summarize the following webpage content in 4-6 concise bullet points using markdown formatting. Focus on the main ideas and key information. 

Format your response as:
- Use bullet points (-)
- Use **bold** for important terms or concepts
- Use *italics* for emphasis where appropriate
- Keep each bullet point clear and informative
- No need for a heading or title, just the bullet points

Webpage content:
${textContent}`;
    
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    
    console.log('Summary generated successfully');
    
    // Return the result
    res.json({
      title,
      favicon,
      summary,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error summarizing webpage:', error.message);
    
    if (error.response) {
      // HTTP error from axios
      return res.status(500).json({ 
        error: `Failed to fetch webpage: ${error.response.status} ${error.response.statusText}` 
      });
    } else if (error.code === 'ENOTFOUND') {
      return res.status(400).json({ 
        error: 'Website not found. Please check the URL.' 
      });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(408).json({ 
        error: 'Request timeout. The website took too long to respond.' 
      });
    } else {
      return res.status(500).json({ 
        error: error.message || 'Failed to generate summary' 
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
