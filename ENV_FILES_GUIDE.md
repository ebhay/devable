# Environment Variables Guide

## ✅ Your Current Setup (Already Configured!)

### Backend `.env` file location: `backend/.env`
```env
# Database Configuration
DATABASE_URL="postgresql://postgres.qoszqduniriwwwhfijux:Abhay@933933@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres.qoszqduniriwwwhfijux:Abhay@933933@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# JWT Configuration
JWT_SECRET="edunation"

# Server Configuration
PORT=3000

# Google OAuth (just added)
GOOGLE_CLIENT_ID="682420998886-1ihee78g8lprmglu6raucgpe9s5js5k6.apps.googleusercontent.com"

# Frontend URL for CORS (just added)
FRONTEND_URL="http://localhost:5173"

# Optional
NODE_ENV="development"
```

### Frontend `.env` file location: `frontend/.env`
```env
VITE_API_URL="http://localhost:3000"
VITE_GOOGLE_CLIENT_ID="682420998886-1ihee78g8lprmglu6raucgpe9s5js5k6.apps.googleusercontent.com"
```

---

## 📋 Sample .env Files (For Reference)

### Backend - `backend/.env`
Create this file in your `backend` folder:

```env
# ═══════════════════════════════════════════════
# Database Configuration
# ═══════════════════════════════════════════════

# Connection pooling URL (use this for production)
DATABASE_URL="postgresql://username:password@host:6543/database"

# Direct URL for migrations and admin tools
DIRECT_URL="postgresql://username:password@host:5432/database"

# ═══════════════════════════════════════════════
# JWT Configuration
# ═══════════════════════════════════════════════

JWT_SECRET="your-super-secret-key-change-this-in-production"

# ═══════════════════════════════════════════════
# Server Configuration
# ═══════════════════════════════════════════════

PORT=3000

# ═══════════════════════════════════════════════
# Google OAuth
# ═══════════════════════════════════════════════

GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"

# ═══════════════════════════════════════════════
# CORS Configuration
# ═══════════════════════════════════════════════

FRONTEND_URL="http://localhost:5173"

# ═══════════════════════════════════════════════
# Optional
# ═══════════════════════════════════════════════

NODE_ENV="development"
```

### Frontend - `frontend/.env`
Create this file in your `frontend` folder:

```env
# ═══════════════════════════════════════════════
# Backend API URL
# ═══════════════════════════════════════════════

VITE_API_URL="http://localhost:3000"

# ═══════════════════════════════════════════════
# Google OAuth Client ID
# ═══════════════════════════════════════════════

VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

---

## 🔍 Variables Explained

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection pooling URL | `postgresql://user:pass@host:6543/db` |
| `DIRECT_URL` | Direct PostgreSQL connection | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for signing JWT tokens | `my-secret-key` |
| `PORT` | Backend server port | `3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |

**Note:** Vite requires `VITE_` prefix for environment variables to be exposed to the frontend.

---

## 🚀 Quick Setup

### 1. Backend Setup
```bash
cd backend

# Copy the example file
# (Your .env already exists and is configured)

# Install dependencies (if not done)
npm install

# Start the server
npm start
```

### 2. Frontend Setup
```bash
cd frontend

# Copy the example file
# (Your .env already exists and is configured)

# Install dependencies (if not done)
npm install

# Start the dev server
npm run dev
```

---

## ⚠️ Important Notes

### Port Configuration
- **Backend runs on:** `http://localhost:3000`
- **Frontend runs on:** `http://localhost:5173` (default Vite port)
- **Backend PORT in .env:** `3000` (your current setup)
- **Frontend API URL in .env:** `http://localhost:3000` ✅

### Google OAuth Setup
1. Both `.env` files must have the **same** `GOOGLE_CLIENT_ID`
2. In Google Cloud Console, add these origins:
   - `http://localhost:5173`
   - `http://localhost:3000`

### Security
- **Never commit `.env` files to git** (they're in `.gitignore`)
- Use different secrets for development and production
- Keep `JWT_SECRET` secure and random

---

## 🧪 Testing Your Setup

### 1. Check Backend
Open: `http://localhost:3000`

Should see: `{"message":"✅ Server is running successfully!"}`

### 2. Check Frontend
Open: `http://localhost:5173`

Should see your app running.

### 3. Test Authentication
Go to: `http://localhost:5173/auth/signup`

Should be able to:
- Sign up as User or Admin
- Sign up with Google (after configuring Google Console)

---

## ❌ Common Issues

### "Port already in use"
**Solution:** Change PORT in `backend/.env` or kill the process using that port

### "Cannot connect to server"
**Solution:** Check that backend is running on the correct port

### "Google OAuth not working"
**Solution:** Make sure both .env files have the same `GOOGLE_CLIENT_ID`

### "CORS errors"
**Solution:** Check that `FRONTEND_URL` in `backend/.env` matches your frontend URL
