---
description: How to deploy the project to GitHub
---

# 🚀 Deploy Yahia Store to GitHub

## Prerequisites
- GitHub account
- Git installed on your computer
- Git Bash (recommended for Windows)

## Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `yahia-store`
4. Description: "Modern e-commerce platform built with Next.js and MongoDB"
5. Choose **Public** or **Private**
6. **DO NOT** check "Add a README file" (we already have one)
7. **DO NOT** add .gitignore or license (already exist)
8. Click **"Create repository"**

## Step 2: Initialize Git and Push Code

Open **Git Bash** (not PowerShell) and navigate to your project:

```bash
cd "/c/Users/yahia/Desktop/New folder/yahia-store"
```

### Initialize Git Repository
```bash
git init
```

### Configure Git (if first time)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Add All Files
```bash
git add .
```

### Create First Commit
```bash
git commit -m "Initial commit: Yahia Store - E-commerce Platform"
```

### Connect to GitHub
Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/yahia-store.git
```

### Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## Step 3: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/yahia-store`
2. Refresh the page
3. You should see all your files uploaded

## 🔧 Troubleshooting

### If Git shows "fork bomb" error:
1. Uninstall Git completely
2. Download latest version from: https://git-scm.com/download/win
3. Install with default settings
4. Restart your computer
5. Try again using Git Bash

### If authentication fails:
GitHub no longer accepts password authentication. You need to use a Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Yahia Store"
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When pushing, use the token as your password

### Alternative: Use GitHub Desktop
If Git Bash doesn't work:

1. Download GitHub Desktop: https://desktop.github.com
2. Install and sign in
3. Click "Add" → "Add existing repository"
4. Select your project folder
5. Click "Publish repository"

## 📝 Future Updates

After making changes to your code, use these commands:

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

## 🌐 Next Steps: Deploy to Vercel

After pushing to GitHub, you can deploy to Vercel:

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your `yahia-store` repository
5. Add environment variable: `MONGODB_URI`
6. Click "Deploy"
7. Your site will be live in ~2 minutes!

---

✅ **Done!** Your project is now on GitHub and ready to share with the world.
