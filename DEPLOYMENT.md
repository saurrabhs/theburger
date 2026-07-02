# 🚀 Deployment Guide

This guide will help you deploy your Premium Burger Experience to Vercel.

---

## ✅ Pre-Deployment Checklist

Your project is **ready to deploy**! Here's what's been verified:

- ✅ Production build successful (`npm run build` passes)
- ✅ TypeScript compilation with no errors
- ✅ ESLint validation passed
- ✅ All 3D models and assets in place
- ✅ KTX2 compressed textures configured
- ✅ Vercel configuration file created
- ✅ `.gitignore` properly configured

---

## 🌐 Deploy to Vercel (Recommended)

### **Method 1: Deploy via Vercel Dashboard (Easiest)**

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Premium Burger Experience"
   git branch -M main
   git remote add origin https://github.com/yourusername/premium-burger-experience.git
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click **"Add New Project"**

3. **Import Your Repository**
   - Select your GitHub repository
   - Click **"Import"**

4. **Configure Project (Auto-detected)**
   - Framework Preset: **Next.js** ✅ (auto-detected)
   - Build Command: `npm run build` ✅ (auto-detected)
   - Output Directory: `.next` ✅ (auto-detected)
   - Install Command: `npm install` ✅ (auto-detected)

5. **Deploy**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://your-project.vercel.app`

---

### **Method 2: Deploy via Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? Press Enter (uses folder name)
   - Directory? Press Enter (current directory)
   - Override settings? **N**

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

## 🔧 Environment Variables

Currently, this project doesn't require environment variables. If you need to add any in the future:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add your variables
4. Redeploy for changes to take effect

---

## 📊 Performance Optimizations

Your deployment includes these optimizations:

### **Already Configured:**
- ✅ KTX2 texture compression (50-70% smaller textures)
- ✅ Static asset caching (31536000s = 1 year)
- ✅ Next.js automatic code splitting
- ✅ Image optimization via Next.js
- ✅ Lenis smooth scrolling
- ✅ React Suspense for 3D models

### **Vercel Automatic Features:**
- ✅ Global CDN distribution
- ✅ Automatic HTTPS
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 Server Push
- ✅ Edge caching

---

## 🌍 Custom Domain (Optional)

### **Add Your Domain:**

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Click **"Add"**
4. Enter your domain name
5. Follow DNS configuration instructions
6. Wait for DNS propagation (5 minutes - 48 hours)

### **Recommended DNS Settings:**
- A Record: `76.76.21.21`
- CNAME Record: `cname.vercel-dns.com`

---

## 📈 Analytics & Monitoring

### **Enable Vercel Analytics (Optional):**

1. Go to **Analytics** tab in Vercel Dashboard
2. Click **"Enable"**
3. Add this to your `app/layout.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react';
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

---

## 🔍 Post-Deployment Checks

After deployment, verify these work correctly:

### **1. 3D Models Load**
- Open browser console
- Look for: `✅ KTX2Loader initialized with transcoder path: /basis/`
- Look for: `✅ Loaded: /models/[ingredient]-compressed.glb`

### **2. Smooth Scrolling Works**
- Scroll should feel smooth and premium
- Text animations should sync with scroll position

### **3. Mobile Responsive**
- Test on phone or use Chrome DevTools
- Burger should scale down to 50% on mobile
- UI should adapt to smaller screens

### **4. Performance Check**
- Open Chrome DevTools → Lighthouse
- Run performance audit
- Target: 90+ Performance Score

---

## 🐛 Troubleshooting

### **Build Fails**
```bash
# Locally test the production build
npm run build
npm start
```

### **Models Don't Load**
- Check browser console for errors
- Verify `/public/models/` contains all `-compressed.glb` files
- Verify `/public/basis/` contains transcoder files

### **Slow Initial Load**
- Models are loading (~5-10MB compressed)
- Consider adding a loading screen
- Preload critical models

### **404 on Assets**
- Ensure assets are in `/public/` directory
- Paths should be `/models/file.glb` not `/public/models/file.glb`

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

- Every push triggers a new deployment
- Preview deployments for pull requests
- Instant rollback if needed

---

## 📱 Preview Deployments

Every pull request gets its own preview URL:
- Test changes before merging
- Share with team/clients
- Automatic cleanup after merge

---

## 💰 Pricing

**Vercel Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Analytics (basic)

**Your project should fit comfortably in the free tier!**

---

## 🎉 You're Done!

Your Premium Burger Experience is now live on the internet! 🍔

**Next Steps:**
1. Share your deployment URL
2. Monitor analytics
3. Gather user feedback
4. Iterate and improve

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Issues:** Create an issue on GitHub

---

**Happy Deploying! 🚀**
