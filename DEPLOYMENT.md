# 🚀 Deployment Checklist

## Pre-Deployment

### Code & Configuration
- [ ] All features tested locally
- [ ] No console errors in browser
- [ ] Backend starts without errors
- [ ] Frontend builds successfully (`npm run build`)
- [ ] All environment variables documented
- [ ] `.env` files added to `.gitignore`
- [ ] Sensitive data removed from code
- [ ] API keys verified and working

### Firebase Setup
- [ ] Firebase project created
- [ ] Email/Password auth enabled
- [ ] Realtime Database created
- [ ] Database security rules configured
- [ ] Production domain added to authorized domains (if using custom domain)
- [ ] Firebase config copied to environment variables

### Git & GitHub
- [ ] Code pushed to GitHub
- [ ] Repository is public (or deployment service has access)
- [ ] README.md is complete
- [ ] `.gitignore` excludes sensitive files

## Backend Deployment

### Platform Options
Choose one: Render, Railway, Heroku, or Google Cloud Run

### Render Deployment Steps
- [ ] Sign up at [render.com](https://render.com)
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure:
  - Name: `bookmark-manager-backend`
  - Root Directory: `backend`
  - Environment: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Add environment variables:
  - `PORT` = 10000 (Render default) or leave empty
  - `GEMINI_API_KEY` = your_key
  - `FIREBASE_API_KEY` = your_key
  - `FIREBASE_AUTH_DOMAIN` = your_domain
  - `FIREBASE_DB_URL` = your_url
  - `FIREBASE_PROJECT_ID` = your_id
- [ ] Deploy!
- [ ] Copy the deployed URL (e.g., `https://bookmark-manager-backend.onrender.com`)

### Railway Deployment Steps
- [ ] Sign up at [railway.app](https://railway.app)
- [ ] New Project → Deploy from GitHub
- [ ] Select repository
- [ ] Add environment variables (same as Render)
- [ ] Deploy!

## Frontend Deployment

### Platform Options
Choose one: Vercel or Netlify

### Vercel Deployment Steps
- [ ] Sign up at [vercel.com](https://vercel.com)
- [ ] Import project from GitHub
- [ ] Configure:
  - Framework Preset: Vite
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] Add environment variables:
  - `VITE_API_URL` = your_backend_url (e.g., `https://bookmark-manager-backend.onrender.com`)
  - `VITE_FIREBASE_API_KEY` = your_key
  - `VITE_FIREBASE_AUTH_DOMAIN` = your_domain
  - `VITE_FIREBASE_DB_URL` = your_url
  - `VITE_FIREBASE_PROJECT_ID` = your_id
- [ ] Deploy!
- [ ] Test the deployed app

### Netlify Deployment Steps
- [ ] Sign up at [netlify.com](https://netlify.com)
- [ ] New site from Git
- [ ] Select repository
- [ ] Configure:
  - Base directory: `frontend`
  - Build command: `npm run build`
  - Publish directory: `frontend/dist`
- [ ] Add environment variables (same as Vercel)
- [ ] Deploy!

## Post-Deployment

### Testing
- [ ] Visit deployed frontend URL
- [ ] Register a new account
- [ ] Add a test bookmark
- [ ] Verify AI summary appears
- [ ] Test regenerate summary
- [ ] Test delete bookmark
- [ ] Test logout and login
- [ ] Test on mobile device
- [ ] Test in different browsers

### Firebase Configuration
- [ ] Add production domain to Firebase authorized domains:
  - Firebase Console → Authentication → Settings → Authorized domains
  - Add your Vercel/Netlify domain

### Performance
- [ ] Check page load speed (use Lighthouse)
- [ ] Verify images load correctly
- [ ] Check mobile responsiveness
- [ ] Test with slow network (Chrome DevTools)

### Security
- [ ] Verify Firebase rules are production-ready
- [ ] Check CORS settings on backend
- [ ] Ensure no API keys exposed in frontend code
- [ ] Test unauthorized access attempts
- [ ] Verify user data isolation

### Monitoring
- [ ] Set up error tracking (optional: Sentry)
- [ ] Monitor backend logs
- [ ] Check Firebase usage quotas
- [ ] Monitor Gemini API usage

## Production Environment Variables

### Backend (.env)
```env
PORT=10000
GEMINI_API_KEY=your_production_key
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_DB_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=your-project-id
```

### Frontend Environment Variables
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DB_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## Firebase Production Rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "bookmarks": {
          "$bookmarkId": {
            ".validate": "newData.hasChildren(['url', 'title', 'summary', 'createdAt'])"
          }
        }
      }
    }
  }
}
```

## Common Deployment Issues

### Backend won't start
- ✅ Check environment variables are set correctly
- ✅ Verify `npm install` completed successfully
- ✅ Check build logs for errors
- ✅ Ensure Node.js version compatibility

### Frontend shows "Cannot connect to server"
- ✅ Verify `VITE_API_URL` points to deployed backend
- ✅ Check backend is running (visit `/api/health`)
- ✅ Verify CORS is enabled on backend
- ✅ Check browser console for CORS errors

### Firebase auth errors
- ✅ Add production domain to Firebase authorized domains
- ✅ Verify Firebase config in environment variables
- ✅ Check Firebase project is in production mode

### AI summaries not working
- ✅ Verify Gemini API key is valid
- ✅ Check API usage limits
- ✅ Review backend logs for errors

## Rollback Plan

If deployment fails:

1. **Keep local version running** - Your local setup still works
2. **Check deployment logs** - Most platforms show detailed error logs
3. **Revert to previous deployment** - Most platforms have rollback feature
4. **Fix issues locally** - Test fix locally before redeploying

## Success Criteria

Your deployment is successful when:

✅ Users can register and login  
✅ Bookmarks can be added  
✅ AI summaries generate correctly  
✅ Real-time updates work  
✅ Mobile experience is good  
✅ No console errors  
✅ Page loads in < 3 seconds  
✅ All features work as expected  

## Next Steps After Deployment

- [ ] Share the app with friends for feedback
- [ ] Monitor usage and errors
- [ ] Plan feature enhancements
- [ ] Consider adding analytics
- [ ] Set up custom domain (optional)
- [ ] Add to portfolio/resume

## Cost Estimates

### Free Tier Limits
- **Firebase**: 50k reads/day, 20k writes/day, 1GB storage
- **Gemini API**: 15 requests/minute, 1500 requests/day
- **Render**: 750 hours/month (enough for 1 app)
- **Vercel**: 100GB bandwidth, 6000 build minutes
- **Netlify**: 100GB bandwidth, 300 build minutes

For typical personal use, everything should stay within free tiers!

---

**Good luck with your deployment! 🚀**
