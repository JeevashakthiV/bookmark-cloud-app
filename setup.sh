#!/bin/bash

echo "🚀 Setting up AI-Powered Smart Bookmark Manager"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend/.env file"
    echo "⚠️  Please edit backend/.env and add your GEMINI_API_KEY"
else
    echo "ℹ️  backend/.env already exists"
fi

echo "📥 Installing backend dependencies..."
npm install
echo "✅ Backend dependencies installed"
echo ""

# Setup Frontend
cd ../frontend
echo "📦 Setting up Frontend..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend/.env file"
    echo "⚠️  Please edit frontend/.env and add your Firebase configuration"
else
    echo "ℹ️  frontend/.env already exists"
fi

echo "📥 Installing frontend dependencies..."
npm install
echo "✅ Frontend dependencies installed"
echo ""

cd ..

echo "================================================"
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Get your Google Gemini API key from:"
echo "   https://makersuite.google.com/app/apikey"
echo ""
echo "2. Set up Firebase project:"
echo "   https://console.firebase.google.com/"
echo ""
echo "3. Edit backend/.env and add your GEMINI_API_KEY"
echo ""
echo "4. Edit frontend/.env and add your Firebase config"
echo ""
echo "5. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "6. In a new terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "🎉 Happy coding!"
