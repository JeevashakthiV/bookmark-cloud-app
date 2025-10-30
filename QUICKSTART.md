# 🚀 Quick Start Guide

## Automated Setup (Linux/Mac)

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- ✅ Create `.env` files from templates
- ✅ Install all dependencies for backend and frontend

## Manual Setup

### 1. Get API Keys

#### Google Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

#### Firebase Configuration
1. Visit: https://console.firebase.google.com/
2. Create a new project (or use existing)
3. Click "Web" (</>) to register your app
4. Copy the config values

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
npm install
```

Edit `backend/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_actual_gemini_key_here
```

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env
npm install
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DB_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

### 4. Enable Firebase Services

#### Enable Authentication:
1. Firebase Console → Authentication → Sign-in method
2. Enable "Email/Password"
3. Save

#### Enable Realtime Database:
1. Firebase Console → Realtime Database
2. Create Database
3. Start in test mode
4. Update rules:

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

### 5. Run the Application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### 6. Test the App

1. Open http://localhost:3000
2. Register a new account
3. Try adding a bookmark:
   - `https://en.wikipedia.org/wiki/OpenAI`
   - `https://github.com/features`
   - `https://react.dev/learn`

## ✅ Verification Checklist

- [ ] Backend starts without errors on port 5000
- [ ] Frontend starts and opens in browser
- [ ] Can register a new user
- [ ] Can login with existing user
- [ ] Can add a bookmark
- [ ] AI summary appears for the bookmark
- [ ] Can regenerate summary
- [ ] Can delete bookmark
- [ ] Can logout

## 🐛 Common Issues

### "Cannot connect to server"
- ✅ Ensure backend is running
- ✅ Check `VITE_API_URL` in frontend/.env

### "Invalid API key"
- ✅ Verify your Gemini API key in backend/.env
- ✅ Make sure there are no extra spaces

### "Firebase auth error"
- ✅ Check Firebase config in frontend/.env
- ✅ Ensure Email/Password auth is enabled
- ✅ Verify all config values are correct

### "Cannot read bookmarks"
- ✅ Check Firebase Realtime Database rules
- ✅ Make sure database URL ends with `.firebaseio.com`
- ✅ Verify user is logged in

## 📚 Additional Resources

- [Full README](./README.md)
- [Google Gemini Docs](https://ai.google.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [React + Vite Docs](https://vitejs.dev/guide/)
