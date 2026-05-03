<div align="center">
 ✨ Smart Folio

  <br />
  
  <a href="https://github.com/abdulsami-S">
    <img src="https://readme-typing-svg.demolab.com?font=Inter&weight=800&size=24&duration=3000&pause=1000&color=00D4FF&center=true&vCenter=true&width=600&lines=Cinematic+3D+Web+Graphics;Secure+CMS+Dashboard;Full-Stack+Architecture;Buttery+Smooth+Scrolling" alt="Typing SVG" />
  </a>

  <br />

  <p align="center">
    <em>A complete, production-grade full-stack 3D personal portfolio with a secure backend, an admin CMS dashboard, JWT authentication, and modern cinematic web graphics.</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Threejs" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>

</div>

---

## 🌟 What is this project? (For Everyone)

> **Imagine having a digital business card, but instead of a boring piece of paper, it's a stunning, interactive 3D universe.**

**Smart Folio** is a premium, cinematic personal website designed to showcase projects, skills, and experience. But it's not just a website—it has a **hidden control panel (Admin Dashboard)**. This means you can update your bio, add new projects, or change your skills just like you would on a social media profile, without ever needing to write or touch code again!

<div align="center">
  <br/>
  <img src="https://skillicons.dev/icons?i=js,html,css,react,nodejs,express,mongodb,tailwind,vite,git,vscode" alt="Skills" />
  <br/>
</div>

---

## 🚀 How It Works (The Big Picture Workflow)

To make it easy to understand, think of this project in three parts: **The Face**, **The Brain**, and **The Vault**.

<br />

<div align="center">

| 🌍 The Face (Frontend) | 🧠 The Brain (Backend Server) | 🔒 The Vault (Database) |
| :---: | :---: | :---: |
| <img src="https://cdn-icons-png.flaticon.com/512/3067/3067260.png" width="60" /> | <img src="https://cdn-icons-png.flaticon.com/512/2162/2162801.png" width="60" /> | <img src="https://cdn-icons-png.flaticon.com/512/2885/2885412.png" width="60" /> |
| **The Public View.** Anyone who visits the site sees a beautiful, cinematic 3D particle sphere. | **The Control Center.** When you save changes in the hidden dashboard, the server processes it securely. | **The Storage.** The Brain securely locks the new information in the database. |
| It seamlessly reads data from the brain to instantly show your latest projects and updates. | It mathematically verifies your identity using JWT before allowing any changes. | Instantly pushes updates back to the public website with your new info. |

</div>

<br />

```mermaid
graph TD
    A[🌍 The Public] -->|Visits Website| B(The Face: 3D Website / Frontend)
    C[👤 You ] -->|Logs In securely| D(The Control Panel: Admin Dashboard)
    D -->|Saves new text/projects| E{The Brain: Backend Server}
    E <-->|Stores Data| F[(The Vault: Database)]
    E -->|Sends New Data| B
```

---

## 💎 Premium Features

- 🌌 **Cinematic 3D Graphics**: A mesmerizing interactive particle sphere that follows your mouse, built with pure mathematics (WebGL).
- 🌊 **Buttery Smooth Scrolling**: Like gliding on ice, powered by professional studio-grade scroll engines.
- 🎛️ **Live Updating Dashboard**: A hidden CMS (Content Management System) to edit your website on the fly. No coding required to update your resume!
- 🔐 **Fort Knox Security**: Two-layer token authentication ensures only *you* can edit your portfolio.

---

## ⚙️ Step-by-Step Setup Guide

Follow these simple steps to get the entire machine running on your computer.

### Step 1: Start The Brain (Backend)
The backend manages the data. It needs to run first.

```bash
# 1. Open your terminal and navigate into the backend folder
cd backend

# 2. Install the necessary engine parts
npm install

# 3. Load the initial data (your projects and admin account)
node scripts/seed.js

# 4. Start the engine!
npm run dev
```
*(The backend is now listening quietly on `http://localhost:5000`)*

<br />

### Step 2: Start The Face (Frontend)
Open a **new** terminal window (keep the backend running in the old one!).

```bash
# 1. Navigate into the frontend folder
cd frontend

# 2. Install the visual tools
npm install

# 3. Launch the website!
npm run dev
```
*(The website is now live and breathing at `http://localhost:5173`)*

---

## 🎮 How to Use Your Control Panel

Want to change the text on your website? Here is how:

1. Go to your secret login page: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
2. Enter your credentials.
3. You are now inside! Click on the different tabs on the left (Projects, Skills, Timeline) to add, edit, or delete items.
4. As soon as you hit "Save", open the public website in a new tab—your changes will be there instantly.
5. Click **Logout** when you're done to lock the vault.

---

## 📁 Folder Structure Explained

For those who want to explore the files, here is how the house is organized:

```text
AI_PORTFOLIO/
├── backend/          # The Brain (Servers, Databases, Security)
│   ├── models/       # Database blueprints (Defines what a "Project" is)
│   ├── routes/       # The API doors (Where the frontend knocks for data)
│   └── scripts/      # Automation tools (Like the seed script to fill the database)
│
└── frontend/         # The Face (What people see and interact with)
    ├── src/
    │   ├── admin/    # Your secret control panel pages and forms
    │   ├── portfolio/# The beautiful 3D public website components
    │   └── context/  # Memory management (Remembering if you are logged in)
```

---

## 🔒 Security Measures

We take security seriously so your portfolio cannot be hacked or defaced:
- **Access Tokens**: Stored safely in short-term React memory to prevent hackers from stealing them via malicious scripts (XSS).
- **Refresh Tokens**: Locked in an `HttpOnly` cookie that even your own code cannot read, making CSRF attacks nearly impossible.
- **Password Encryption**: We use `bcryptjs` (with 12 salt rounds) to scramble your password so thoroughly that even if the database is ever compromised, your password remains a secret.
