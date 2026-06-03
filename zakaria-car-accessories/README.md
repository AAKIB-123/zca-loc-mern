# Zakaria Car Accessories — MERN Stack

## 📁 Project Structure

```
zakaria-car-accessories/
├── package.json              ← Root (runs both with concurrently)
│
├── server/                   ← Express + MongoDB backend
│   ├── index.js              ← Server entry point
│   ├── .env.example          ← Copy to .env and fill in values
│   ├── middleware/
│   │   └── auth.js           ← JWT protection middleware
│   ├── models/
│   │   ├── Admin.js          ← Admin user (bcrypt hashed pw)
│   │   ├── Content.js        ← Key-value site content store
│   │   └── Media.js          ← Photos & videos metadata
│   ├── routes/
│   │   ├── auth.js           ← POST /api/auth/login, /seed
│   │   ├── content.js        ← GET/PUT /api/content/:key
│   │   ├── media.js          ← GET/POST/PATCH/DELETE /api/media
│   │   └── contacts.js       ← Placeholder
│   └── uploads/
│       ├── images/           ← Uploaded images stored here
│       └── videos/           ← Uploaded videos stored here
│
└── client/                   ← React frontend
    ├── public/index.html
    └── src/
        ├── App.js            ← Routes: / and /admin/*
        ├── index.js          ← ReactDOM + Toast provider
        ├── index.css
        ├── context/
        │   └── AuthContext.js← Token stored in localStorage
        ├── utils/
        │   └── api.js        ← Axios instance (auto JWT header)
        ├── components/
        │   ├── Header.js + Header.module.css
        │   ├── AnimatedSection.js
        │   └── MediaGallery.js (public gallery with lightbox)
        └── pages/
            ├── HomePage.js           ← Public website
            ├── AdminLoginPage.js     ← /admin/login
            ├── AdminDashboard.js     ← Sidebar layout
            └── admin/
                ├── AdminOverview.js  ← Stats & quick links
                ├── AdminContent.js   ← Edit hero/address/contacts/social
                └── AdminMedia.js     ← Upload & manage photos/videos
```

## 🚀 Setup & Run

### 1. Clone and install
```bash
git clone <repo>
cd zakaria-car-accessories
npm run install-all
```

### 2. Configure environment
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and desired admin credentials
```

### 3. Seed the admin account (one-time)
```bash
# With server running, call:
curl -X POST http://localhost:5000/api/auth/seed
```

### 4. Start development
```bash
# From root:
npm run dev
# → React on http://localhost:3000
# → Express on http://localhost:5000
```

## 🔐 Admin Panel
- URL: `http://localhost:3000/admin`
- Default credentials: set in `.env` (ADMIN_EMAIL / ADMIN_PASSWORD)

## 📦 Production Build
```bash
cd client && npm run build
# Then set NODE_ENV=production and start server — it serves the build
```

## 🗂️ API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | — | Admin login |
| POST | /api/auth/seed | — | Create first admin |
| GET | /api/content | — | Get all content |
| GET | /api/content/:key | — | Get one section |
| PUT | /api/content/:key | ✅ | Update section |
| GET | /api/media | — | List media (filterable) |
| POST | /api/media | ✅ | Upload image/video |
| PATCH | /api/media/:id | ✅ | Update metadata |
| DELETE | /api/media/:id | ✅ | Delete file |
