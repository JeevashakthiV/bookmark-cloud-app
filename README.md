# 🚀 AI-Powered Smart Bookmark Manager

A modern web application that allows users to save bookmarks with **automatic AI-generated summaries** powered by **Google Gemini 1.5 Flash**. Built with React, Node.js, Express, and Firebase.

## ✨ Features

- 🔐 **User Authentication** - Secure email/password authentication with Firebase
- 🤖 **AI Summaries** - Automatic webpage summarization using Google Gemini 1.5 Flash
- 📊 **Real-time Database** - Firebase Realtime Database for instant updates
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ♻️ **Regenerate Summaries** - Update summaries anytime
- 🗑️ **Easy Management** - Simple bookmark deletion
- 🌐 **Favicon & Title** - Automatic extraction of page metadata

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Firebase SDK** for authentication and database
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **Google Gemini 1.5 Flash** AI model
- **Cheerio** for HTML parsing
- **Axios** for HTTP requests

### Database & Auth
- **Firebase Authentication**
- **Firebase Realtime Database**

## 📁 Project Structure

```
smart-bookmark-manager/
│
├── backend/
│   ├── server.js              # Express server with Gemini integration
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment variables template
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── AuthPage.js        # Login/Register page
│   │   ├── firebaseConfig.js  # Firebase configuration
│   │   ├── summarizerAPI.js   # API calls to backend
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── postcss.config.js      # PostCSS configuration
│   ├── .env.example           # Environment variables template
│   └── .gitignore
│
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Firebase project
- A Google Gemini API key

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd bookmark-cloud-app
```

### Step 2: Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click on "Web" (</> icon) to register your web app
4. Copy the Firebase configuration values (you'll need them later)

#### Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable it and click **Save**

#### Enable Firebase Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click **Create Database**
3. Choose a location (e.g., us-central1)
4. Start in **Test mode** (or configure rules as needed)
5. Click **Enable**

#### Configure Database Rules (Important for Security)

Replace the default rules with:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

This ensures users can only read/write their own bookmarks.

### Step 3: Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the API key (keep it secure!)

### Step 4: Configure Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase config (optional for backend)
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DB_URL=https://your_project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
```

### Step 5: Configure Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
VITE_API_URL=http://localhost:5000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DB_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Step 6: Run the Application

#### Terminal 1 - Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Backend server running on http://localhost:5000
📊 Health check: http://localhost:5000/api/health
```

#### Terminal 2 - Start Frontend

```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:3000`

## 🎯 Usage

### 1. Register / Login

- Open the app at `http://localhost:3000`
- Create a new account or login with existing credentials
- Password must be at least 6 characters

### 2. Add Bookmarks

- Enter any URL in the input field (e.g., `https://en.wikipedia.org/wiki/OpenAI`)
- Click **Add Bookmark**
- Wait for the AI to fetch and summarize the page (takes 3-10 seconds)
- The bookmark will appear with:
  - Page title
  - Favicon
  - AI-generated summary
  - Creation date

### 3. Manage Bookmarks

- **Regenerate Summary**: Click the "♻ Regenerate" button to get a fresh AI summary
- **Delete**: Click the "❌ Delete" button to remove a bookmark
- **Visit Page**: Click on the title to open the original URL

### 4. Logout

- Click the **Logout** button in the header

## 🧪 Testing with Sample URLs

Try these URLs to see the AI summarization in action:

- `https://en.wikipedia.org/wiki/Artificial_intelligence`
- `https://www.bbc.com/news`
- `https://github.com/features`
- `https://react.dev/learn`
- `https://nodejs.org/en/about`

## 🔧 API Endpoints

### Backend API

#### `POST /api/summarize`

Fetches a webpage and generates an AI summary.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "title": "Example Domain",
  "favicon": "https://example.com/favicon.ico",
  "summary": "• This domain is for use in examples...\n• It may be used in documentation...",
  "generatedAt": "2025-10-30T12:00:00.000Z"
}
```

#### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🔒 Security Best Practices

### For Development

The `.env.example` files are included for reference. Never commit actual `.env` files.

### For Production

1. **Firebase Rules**: Use strict security rules
2. **Environment Variables**: Use secure environment variable storage
3. **API Keys**: Keep your Gemini API key secure
4. **CORS**: Configure CORS properly for production domains
5. **HTTPS**: Always use HTTPS in production

### Recommended Firebase Realtime Database Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "bookmarks": {
          ".indexOn": ["createdAt"]
        }
      }
    }
  }
}
```

## 🐛 Troubleshooting

### Backend won't start

- ✅ Check if port 5000 is available
- ✅ Verify `GEMINI_API_KEY` is set in `.env`
- ✅ Run `npm install` in the `backend` folder

### Frontend shows "Cannot connect to server"

- ✅ Make sure backend is running on port 5000
- ✅ Check `VITE_API_URL` in frontend `.env`
- ✅ Verify CORS is enabled in backend

### Firebase Authentication errors

- ✅ Verify Firebase config in frontend `.env`
- ✅ Check that Email/Password auth is enabled in Firebase Console
- ✅ Ensure your Firebase API key is correct

### "Unable to extract content" error

- ✅ Some websites block scraping
- ✅ Try a different URL
- ✅ Check if the website requires authentication

### Bookmarks not showing

- ✅ Check Firebase Realtime Database rules
- ✅ Verify user is logged in
- ✅ Check browser console for errors

## 📦 Deployment

### Backend Deployment (Railway, Render, or Heroku)

1. Push code to GitHub
2. Connect your repository to the platform
3. Set environment variables
4. Deploy!

### Frontend Deployment (Vercel or Netlify)

1. Push code to GitHub
2. Connect repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables with your Firebase config
6. Deploy!

**Important**: Update `VITE_API_URL` to your deployed backend URL.

## 🎨 Customization

### Change Colors

Edit `frontend/tailwind.config.js` to customize the color scheme.

### Modify AI Prompt

Edit the prompt in `backend/server.js` around line 120:

```javascript
const prompt = `Your custom prompt here:

${textContent}`;
```

### Adjust Summary Length

Modify the prompt to request longer or shorter summaries.

### Add More Bookmark Fields

1. Update the Firebase write in `frontend/src/App.jsx`
2. Add UI fields for the new data
3. Update the bookmark card display

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the amazing AI model
- [Firebase](https://firebase.google.com/) for authentication and database
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful UI
- [Vite](https://vitejs.dev/) for the fast development experience

## 💡 Future Enhancements

- [ ] Search and filter bookmarks
- [ ] Tags and categories
- [ ] Export bookmarks as JSON/CSV
- [ ] Browser extension
- [ ] Shared bookmark collections
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Bookmark folders/organization
- [ ] Full-text search in summaries

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review Firebase Console for auth/database issues
3. Check browser console for frontend errors
4. Check backend terminal for server errors

---

**Built with ❤️ using React, Node.js, Firebase, and Google Gemini**