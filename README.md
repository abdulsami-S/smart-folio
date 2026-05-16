<div align="center">

# ✨ Smart Folio
### *Premium Antigravity-Themed Personal Portfolio & Content Management System*

**A complete, production-grade personal portfolio — mesmerize visitors with zero-gravity floating text, antigravity particle physics, a walking character preloader, and an editorial design. Manage your content via a secure admin dashboard without touching code.**

<br/>

[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-Coming%20Soon-gold?style=for-the-badge)](#)
[![Backend API](https://img.shields.io/badge/⚙️%20Backend%20API-Express.js-blueviolet?style=for-the-badge)](#)
[![Tech](https://img.shields.io/badge/React%20+%20GSAP-Full%20Stack-orange?style=for-the-badge)](#-tech-stack)
[![DB](https://img.shields.io/badge/MongoDB-Local/Atlas-green?style=for-the-badge)](#)

</div>

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><b>🌌 Antigravity Hero Section</b></td>
    <td align="center"><b>🚀 Horizontal Pin-Scroll Skills</b></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/abdulsami-S/smart-folio/main/assets/screenshots/hero.png" width="480" alt="Antigravity Hero with Floating Text & Particle Trails"/></td>
    <td><img src="https://raw.githubusercontent.com/abdulsami-S/smart-folio/main/assets/screenshots/skills.png" width="480" alt="Horizontal Pin Scroll Skills"/></td>
  </tr>
  <tr>
    <td align="center"><b>📂 Dynamic Projects Panel</b></td>
    <td align="center"><b>📬 Contact</b></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/abdulsami-S/smart-folio/main/assets/screenshots/projects.png" width="480" alt="Interactive Projects Preview"/></td>
    <td><img src="https://raw.githubusercontent.com/abdulsami-S/smart-folio/main/assets/screenshots/contact.png" width="480" alt="Contact Form & Live IST Clock"/></td>
  </tr>
  <tr>
    <td align="center"><b>🔐 Secure Admin Login</b></td>
    <td align="center"><b>🎛️ CMS Dashboard</b></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/abdulsami-S/smart-folio/main/assets/screenshots/login.png" width="480" alt="JWT Admin Login"/></td>
    <td><img src="https://raw.githubusercontent.com/abdulsami-S/smart-folio/main/assets/screenshots/dashboard.png" width="480" alt="Manage Projects, Skills, Timeline"/></td>
  </tr>
</table>

---

## 🤔 What Is This?

Think of this as a **digital business card on steroids**:

- 🌍 **Visitors** get to experience a premium, antigravity-themed website with floating text animations, upward-drifting particle physics, interactive cursor effects, a walking character preloader, and buttery smooth scrolling.
- 🔐 **You (the owner)** can log into a hidden dashboard with a password to manage projects, update skills, edit your bio, and view your timeline.
- ☁️ **Everything is dynamic** — no need to redeploy or touch the code when you finish a new project or learn a new skill. Just update it from the dashboard and it instantly reflects on the live site!

---

## ✨ Features

### For Visitors (Public Portfolio)
| Feature | Description |
|---------|-------------|
| 🚶 **Walking Character Preloader** | fromanother.love-inspired cream loader: a CSS-animated SVG walking figure in profile view with natural limb gait, a GSAP percentage counter (0→100%), and a thin progress bar — all fading away to reveal the portfolio. |
| 🪐 **Antigravity Hero Section** | Character-level floating text with independent drift physics, word-level gradient headings that bob in zero-gravity, cursor-following spotlight, upward-shooting particle trails, ambient gravity debris, parallax orbs, magnetic buttons with idle float, and sketch-line editorial dividers. |
| 🌊 **Smooth Scrolling** | Studio-grade fluid scrolling powered by Lenis |
| ✨ **Cinematic Animations** | Blur-to-clear entrances and scroll-triggered animations using GSAP |
| 📂 **Interactive Projects** | Dynamic project cards with hover effects and gradient backgrounds |
| 🚀 **Horizontal Pin Scroll** | Unique scrolling mechanics for the Skills section with expanding active cards and Devicon-powered tech stack pills |
| 📢 **Marquee Ticker** | Auto-scrolling ticker strip for additional visual flair |
| 💡 **CTA Banner** | Scroll-animated call-to-action section with glassmorphism styling |
| ⏱️ **Live IST Clock** | A ticking, real-time precise clock embedded in the footer |
| 🖱️ **Custom Cursor** | Glowing dot + outer ring cursor with antigravity particle trail (particles float UP) |
| 🌗 **Dark / Light Theme** | Full theme toggle with persistent preference stored in localStorage |

### For the Owner (Admin Dashboard)
| Feature | Description |
|---------|-------------|
| 🔐 **Secure Login** | Password-protected admin dashboard with encrypted authentication |
| 📊 **Overview Dashboard** | At-a-glance summary of all portfolio content |
| 📦 **Manage Projects** | Add, edit, delete, reorder (drag-and-drop via dnd-kit), and toggle visibility of portfolio projects |
| 🛠️ **Update Skills** | Add new technologies, proficiency levels, categories, and toggle visibility |
| 📖 **Edit Bio & Timeline** | Keep your journey and experience completely up-to-date with drag-and-drop reordering |
| 🎨 **Hero Editor** | Customize hero section content directly from the dashboard |
| 🔗 **Social Links Editor** | Manage all your social media links in one place |
| ⚡ **Instant Sync** | Changes made in the dashboard instantly update the public-facing portfolio |

### Backend Architecture & Security
| Feature | Description |
|---------|-------------|
| 🔐 **Two-Token JWT Auth** | Stateless, highly secure authentication using Access and HttpOnly Refresh tokens |
| 🛡️ **XSS & CSRF Protection** | Tokens are stored properly in memory and strictly isolated cookies |
| 🔑 **Password Hashing** | Bcrypt with 12 salt rounds ensures maximum database security |
| ⏱️ **Rate Limiting** | Login endpoint is rate-limited to 5 attempts per 15 minutes per IP |
| ✅ **Input Validation** | All POST/PUT endpoints validated with express-validator (type, length, format checks) |
| 🪖 **HTTP Security Headers** | Helmet.js sets 11+ security headers (HSTS, X-Frame-Options, CSP, etc.) |
| 🗄️ **MongoDB Database** | Fast, flexible NoSQL schema using Mongoose ORM |

---

## 🧠 System Architecture & Workflow

> Here is how data flows through **Smart Folio** to serve visitors and the administrator.

```mermaid
flowchart TD
    A([🌍 Public Visitor / 👤 Admin]) --> B[React Frontend\nVite]

    B -->|HTTP API Request| C[Express.js Backend\nNode.js]

    C --> D{Request Type?}

    D -->|Fetch Portfolio Data| E[(MongoDB\nProjects, Skills, Bio)]
    D -->|Admin Login| H{bcrypt\nPassword Check}
    D -->|CMS Update Action| JWT{JWT Auth\nValidation}

    JWT -->|✅ Valid Token| ADM[Execute Database Update]
    JWT -->|❌ Invalid Token| J([🚫 401 Unauthorized])

    H -->|✅ Valid| I[Return JWT Access & Refresh Tokens]
    H -->|❌ Invalid| J

    E --> M[JSON Response]
    ADM --> M
    I --> M

    M -->|Rendered via React + GSAP| N([🖥️ Antigravity UI shown to User])
```

---

### ⚙️ How It Works — Step by Step

1. **Visitor opens the website** → A cinematic walking character preloader plays: a profile-view SVG figure walks with natural limb gait on a warm cream background, a percentage counter ticks 0→100%, and a thin progress bar fills — then everything fades away.
2. **Homepage appears** → The React frontend loads with antigravity-themed GSAP animations: character-level floating text, gravity debris rising upward, upward-shooting particle trails, and smooth scrolling via Lenis.
3. **Data is fetched** → The frontend requests the latest bio, projects, and skills from the Express backend.
4. **Backend queries the database** → Express talks to MongoDB to retrieve all visible data.
5. **Antigravity UI is rendered** → GSAP handles the entrance animations with zero-gravity physics, and Lenis takes over scroll hijacking for fluid motion.
6. **You (Admin) log in** → You go to `/admin/login`. Your password is verified against the bcrypt hash in the database.
7. **Tokens are issued** → You receive a short-lived Access Token in memory and a secure `HttpOnly` Refresh Token in your browser cookies.
8. **You manage content** → Every time you add a project or edit a skill, the backend verifies your Access Token before making the change in MongoDB. Drag-and-drop reordering is powered by dnd-kit.

---

## 🛠️ Tech Stack

| Layer | Technology | Why? |
|-------|-----------|------|
| **Frontend Framework** | React.js (Vite) | Lightning fast HMR and component-based UI |
| **Styling** | Tailwind CSS | Rapid, utility-first custom design system |
| **Animations** | GSAP + CSS Keyframes | Industry-standard scroll, entrance & antigravity float animations |
| **Particle Effects** | Canvas 2D API | High-performance cursor-following antigravity particle trail system |
| **Smooth Scroll** | Lenis (@studio-freight) | Buttery smooth, lightweight scroll hijacking |
| **Drag & Drop** | @dnd-kit | Accessible, performant drag-and-drop reordering for admin CMS |
| **Icons** | Lucide React + Devicons | Consistent icon library + colored tech stack icons |
| **Input Validation** | express-validator | Server-side validation and sanitization for all API endpoints |
| **Backend** | Node.js + Express | Fast, JavaScript-native REST API |
| **Database** | MongoDB + Mongoose | Flexible NoSQL document storage perfectly suited for CMS |
| **Auth** | JWT + bcryptjs | Bulletproof, stateless secure authentication |
| **Security Headers** | Helmet.js | Automatic HTTP security headers (HSTS, CSP, XSS filter, etc.) |
| **Notifications** | react-hot-toast | Elegant toast notifications for admin actions |
| **Routing** | react-router-dom v6 | Declarative, nested routing with protected routes |

---

## 📂 Project Structure

```
AI_PORTFOLIO/
│
├── 📁 backend/
│   ├── 📁 config/
│   │   ├── db.js               ← MongoDB connection setup
│   │   └── jwt.js              ← JWT token configuration
│   ├── 📁 controllers/
│   │   ├── auth.controller.js  ← Login, refresh, logout, session check
│   │   ├── portfolio.controller.js ← Bio & social links CRUD
│   │   ├── projects.controller.js  ← Projects CRUD + reorder + visibility
│   │   ├── skills.controller.js    ← Skills CRUD + visibility toggle
│   │   └── timeline.controller.js  ← Timeline CRUD + reorder
│   ├── 📁 middleware/
│   │   ├── auth.js             ← JWT verification middleware
│   │   ├── errorHandler.js     ← Global error handler
│   │   ├── rateLimiter.js      ← Login rate limiting (5 req / 15 min)
│   │   └── validate.js         ← express-validator rules for all endpoints
│   ├── 📁 models/
│   │   ├── Admin.model.js      ← Admin user schema
│   │   ├── Portfolio.model.js  ← Bio, social links schema
│   │   ├── Project.model.js    ← Project schema (order, visibility)
│   │   ├── Skill.model.js      ← Skill schema (category, proficiency)
│   │   └── Timeline.model.js   ← Timeline entry schema (order)
│   ├── 📁 routes/
│   │   ├── auth.routes.js      ← /api/auth/*
│   │   ├── portfolio.routes.js ← /api/portfolio
│   │   ├── projects.routes.js  ← /api/projects/*
│   │   ├── skills.routes.js    ← /api/skills/*
│   │   └── timeline.routes.js  ← /api/timeline/*
│   ├── 📁 scripts/
│   │   └── seed.js             ← Populates DB with initial admin & demo data
│   ├── server.js               ← Main Express entry point
│   ├── .env                    ← Secret keys & DB URI (git-ignored)
│   └── .env.example            ← Example environment configuration
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 admin/
│   │   │   ├── AdminLayout.jsx      ← Dashboard shell with sidebar navigation
│   │   │   ├── AdminLogin.jsx       ← Secure login page
│   │   │   ├── ProtectedRoute.jsx   ← Auth guard wrapper
│   │   │   └── 📁 pages/
│   │   │       ├── DashboardOverview.jsx ← At-a-glance content summary
│   │   │       ├── ProjectsManager.jsx  ← Projects CRUD + drag reorder
│   │   │       ├── SkillsManager.jsx    ← Skills CRUD + visibility
│   │   │       ├── TimelineManager.jsx  ← Timeline CRUD + drag reorder
│   │   │       ├── AboutEditor.jsx      ← Bio text editor
│   │   │       ├── HeroEditor.jsx       ← Hero section content editor
│   │   │       └── SocialEditor.jsx     ← Social links manager
│   │   ├── 📁 api/
│   │   │   ├── axiosInstance.js     ← Axios config with token refresh interceptor
│   │   │   ├── auth.api.js         ← Auth API calls
│   │   │   ├── portfolio.api.js    ← Portfolio API calls
│   │   │   ├── projects.api.js     ← Projects API calls
│   │   │   ├── skills.api.js       ← Skills API calls
│   │   │   └── timeline.api.js     ← Timeline API calls
│   │   ├── 📁 context/
│   │   │   ├── AuthContext.jsx      ← JWT auth state & token management
│   │   │   ├── PortfolioContext.jsx ← Global portfolio data provider
│   │   │   └── ThemeContext.jsx     ← Dark/light theme with localStorage
│   │   ├── 📁 portfolio/
│   │   │   ├── 📁 components/
│   │   │   │   ├── IntroScreen.jsx   ← Walking character preloader (CSS-animated SVG)
│   │   │   │   ├── Navbar.jsx        ← Sticky nav with icon tabs & active section tracking
│   │   │   │   ├── Footer.jsx        ← Live IST clock + attribution
│   │   │   │   ├── CustomCursor.jsx  ← Global custom cursor provider
│   │   │   │   ├── MarqueeTicker.jsx ← Auto-scrolling text ticker
│   │   │   │   └── ThemeToggle.jsx   ← Dark/light mode switch
│   │   │   ├── 📁 sections/
│   │   │   │   ├── HeroSection.jsx      ← Antigravity hero (floating text, particles, debris)
│   │   │   │   ├── AboutSection.jsx     ← Bio, stats, and journey overview
│   │   │   │   ├── SkillsSection.jsx    ← Horizontal pin-scroll skill cards
│   │   │   │   ├── ProjectsSection.jsx  ← Dynamic project showcase
│   │   │   │   ├── TimelineSection.jsx  ← Experience & education timeline
│   │   │   │   ├── CTABannerSection.jsx ← Call-to-action with glassmorphism
│   │   │   │   └── ContactSection.jsx   ← Contact form
│   │   │   └── 📁 data/
│   │   │       └── projects.js          ← Fallback project data
│   │   ├── App.jsx               ← Main routing & GSAP/Lenis setup
│   │   ├── main.jsx              ← React DOM entry point
│   │   └── index.css             ← Tailwind, CSS variables & custom scrollbar
│   │
│   ├── index.html                ← Entry HTML with Google Fonts
│   ├── vite.config.js            ← Vite bundler config
│   ├── tailwind.config.js        ← Tailwind theme extension
│   ├── postcss.config.js         ← PostCSS plugin config
│   └── package.json              ← Frontend dependencies
│
├── 📁 assets/
│   └── 📁 screenshots/          ← README screenshots (hero, skills, projects, etc.)
│
├── .gitignore
└── README.md                     ← You are here!
```

---

## 🚀 Getting Started (Local Setup)

> **Prerequisites**: You need [Node.js](https://nodejs.org/) (v18+) and [MongoDB](https://www.mongodb.com/) installed and running locally (or a MongoDB Atlas URI).

### Step 1 — Clone the Project
```bash
git clone https://github.com/abdulsami-S/smart-folio.git
cd smart-folio
```

### Step 2 — Set Up the Backend
```bash
cd backend
npm install
```

Copy the provided example environment file to create your own `.env` file:
```bash
cp .env.example .env
```

Open `backend/.env` and configure:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sami_portfolio
JWT_SECRET=<generate-a-random-64-byte-hex>
REFRESH_SECRET=<generate-a-different-random-64-byte-hex>
ADMIN_USERNAME=sami
ADMIN_PASSWORD=your_secure_password
CLIENT_URL=http://localhost:5173
```

> 💡 **Tip**: Generate secure JWT secrets with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

Seed the database with initial data:
```bash
node scripts/seed.js
```

Start the backend server:
```bash
npm run dev
# API running at http://localhost:5000
```

### Step 3 — Set Up the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
# Website running at http://localhost:5173
```

---

## 📡 Key API Endpoints

| Method | Endpoint | What it does | Protected |
|--------|----------|--------------|-----------|
| `POST` | `/api/auth/login` | Authenticate admin & generate tokens | ❌ |
| `POST` | `/api/auth/refresh`| Rotate access token via HttpOnly cookie | ❌ |
| `POST` | `/api/auth/logout` | Clear refresh token cookies | ❌ |
| `GET`  | `/api/auth/me`   | Verify session and get admin profile | ✅ |
| `GET`  | `/api/portfolio` | Get main bio and social links | ❌ |
| `PUT`  | `/api/portfolio` | Update main bio and social links | ✅ |
| `GET`  | `/api/projects` | Get all visible projects | ❌ |
| `POST` | `/api/projects` | Add a new project | ✅ |
| `PUT`  | `/api/projects/:id` | Update an existing project | ✅ |
| `DELETE`| `/api/projects/:id` | Delete a project | ✅ |
| `PATCH`| `/api/projects/reorder` | Reorder projects | ✅ |
| `PATCH`| `/api/projects/:id/visibility` | Toggle project visibility | ✅ |
| `GET`  | `/api/skills` | Get all skills | ❌ |
| `POST` | `/api/skills` | Add a new skill | ✅ |
| `PUT`  | `/api/skills/:id` | Update an existing skill | ✅ |
| `DELETE`| `/api/skills/:id` | Delete a skill | ✅ |
| `PATCH`| `/api/skills/:id/visibility` | Toggle skill visibility | ✅ |
| `GET`  | `/api/timeline` | Get journey/timeline items | ❌ |
| `POST` | `/api/timeline` | Add a new timeline entry | ✅ |
| `PUT`  | `/api/timeline/:id` | Update a timeline entry | ✅ |
| `DELETE`| `/api/timeline/:id` | Delete a timeline entry | ✅ |
| `PATCH`| `/api/timeline/reorder` | Reorder timeline entries | ✅ |

---

## ☁️ Deployment Architecture (Recommended)

| Service | Platform | Purpose |
|---------|----------|---------|
| Frontend | Vercel | Hosts the React/Vite UI with global edge caching |
| Backend | Render / Railway | Hosts the Express.js REST API |
| Database | MongoDB Atlas | Cloud-hosted NoSQL database |

---

## 🧠 What I Learned Building This

- ✅ How to build **antigravity text animations** with GSAP — character-level and word-level floating physics where each element drifts independently in zero-gravity.
- ✅ How to create **CSS-animated SVG walking figures** with natural bipedal gait: arm swing opposite to legs, head bob, foot contact, and ground shadow pulsing.
- ✅ How to build **upward-shooting particle trail systems** using the Canvas 2D API with reversed gravity physics and radial glow gradients.
- ✅ How to construct robust, high-performance scroll animations using **GSAP ScrollTrigger** and **Lenis**, including horizontal pin-scroll sections.
- ✅ How to build a custom Content Management System (**CMS**) from scratch with **drag-and-drop reordering** (dnd-kit) to completely decouple content from code.
- ✅ How to implement highly secure authentication using **HTTP-only cookies** and a dual-token (Access + Refresh) architecture with automatic token refresh via Axios interceptors.
- ✅ How to design editorial-quality UI elements: sketch-line SVG dividers, magnetic buttons with idle float, gravity debris particles, and ambient parallax orbs.
- ✅ How to design a complete **dark/light theme system** with CSS custom properties and React context that extends from the preloader through every section.
- ✅ How to integrate **Devicon** for colored technology icons in interactive skill cards with hover tooltips.

---

## 🎯 Purpose

This project was built to elevate my personal brand by showcasing an absolute mastery of modern web technologies. Instead of a standard static website, I aimed to build an agency-quality, full-stack platform that acts as both a visual centerpiece and a functional, scalable application — with a distinctive **antigravity** design language that sets it apart from every other portfolio on the internet.

---

## 👨‍💻 Author

<div align="center">

**Shaik Abdul Sami**

</div>

---

<div align="center">

## ⭐ If You Like This Project

**Give it a star on GitHub — it really helps!** ⭐

</div>
