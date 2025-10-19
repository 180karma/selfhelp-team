# 🔑 How to Set Up Your Gemini API Key

## ⚠️ SECURITY WARNING

**NEVER** share your API key publicly:
- ❌ Don't post in chat/forums
- ❌ Don't commit to Git
- ❌ Don't share in screenshots
- ❌ Don't email to others
- ✅ Only store in `.env.local` (which is gitignored)

## Step-by-Step Setup

### 1. Get Your API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the generated key (starts with `AIza...`)

### 2. Create `.env.local` File

In your project root (same folder as `package.json`), create a file named `.env.local`:

**On Windows:**
```powershell
# In PowerShell
notepad .env.local
```

**Content of `.env.local`:**
```env
GEMINI_API_KEY=AIza...your_actual_key_here
```

Replace `AIza...your_actual_key_here` with your actual key.

### 3. Verify `.gitignore`

Make sure `.env*` is in your `.gitignore` file (it already is in this project):

```gitignore
.env*
```

This prevents accidentally committing your API key to Git.

### 4. Restart Development Server

After creating `.env.local`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 5. Test It Works

Visit http://localhost:9002 and try using AI features like:
- Chat with AI agents
- Create diary entries
- Get wellness insights

## 🔒 Security Best Practices

### Local Development
- ✅ Store in `.env.local`
- ✅ Keep `.env*` in `.gitignore`
- ✅ Never commit the actual key

### Production/Deployment
- Use environment variables in your hosting platform:
  - **Vercel**: Project Settings → Environment Variables
  - **Netlify**: Site Settings → Environment Variables
  - **Firebase**: `firebase functions:config:set`
  - **Heroku**: Config Vars in Settings

### If Your Key Gets Exposed
1. **Immediately revoke** it at https://aistudio.google.com/app/apikey
2. Generate a **new** key
3. Update your `.env.local` with the new key
4. Restart your server

## 📁 File Structure

Your project should look like this:

```
Holistic Healing Team/
├── .env.local          ← Your actual key (NEVER commit!)
├── .env.local.example  ← Template (safe to commit)
├── .gitignore          ← Contains .env*
├── package.json
├── src/
└── ...
```

## 🆘 Troubleshooting

### "API key not found" error
- Check `.env.local` exists in project root
- Check key is on a line like: `GEMINI_API_KEY=AIza...`
- Restart dev server after creating the file

### "Invalid API key" error
- Key might be revoked - create a new one
- Check for extra spaces/quotes around the key
- Make sure you copied the complete key

### Changes not taking effect
- Restart the dev server
- Clear browser cache
- Check for typos in variable name

## 📞 Need Help?

If you're still having issues:
1. Verify your key works: https://aistudio.google.com/app/apikey
2. Check the key is in `.env.local` (not `.env` or other names)
3. Ensure there are no quotes around the key value
4. Restart your dev server

## ✅ You're All Set!

Once your `.env.local` is set up correctly, your ThriveWell app will have full AI capabilities! 🎉

