require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin.model');
const Project = require('../models/Project.model');
const Skill = require('../models/Skill.model');
const Timeline = require('../models/Timeline.model');
const Portfolio = require('../models/Portfolio.model');

const seedDB = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    // 2. Clear all existing collections
    await Admin.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Timeline.deleteMany({});
    await Portfolio.deleteMany({});
    console.log('Cleared existing data.');

    // 3. Hash ADMIN_PASSWORD with bcrypt (rounds: 12) -> save Admin
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await Admin.create({
      username: process.env.ADMIN_USERNAME,
      passwordHash
    });
    console.log('Admin seeded.');

    // 4. Seed Portfolio document with Sami's data
    await Portfolio.create({
      name: "Shaik Abdul Sami",
      tagline: "Full Stack Developer · Software Engineer · IIIT Dharwad '27",
      bio: "Pre-final year B.Tech CSE student at IIIT Dharwad (graduating 2027) with hands-on experience building full-stack web applications and AI-powered systems. Skilled in Python, JavaScript, React, and Flask.",
      email: "workwithsami07@gmail.com",
      phone: "+91 93812 09996",
      github: "https://github.com/abdulsami-S",
      linkedin: "https://linkedin.com/in/abdul-sami",
      heroTitles: ["Full Stack Developer", "Software Engineer", "AI Builder", "Problem Solver", "IIIT Dharwad '27"],
      resumeUrl: "",
      socials: {
        github: "https://github.com/abdulsami-S",
        linkedin: "https://linkedin.com/in/abdul-sami",
        twitter: "",
        email: "workwithsami07@gmail.com"
      }
    });
    console.log('Portfolio seeded.');

    // 5. Seed 4 Projects
    await Project.insertMany([
      {
        title: "GeoSafe AI – Smart Land Analyzer",
        description: "Full-stack geospatial web app evaluating land safety using GIS datasets and a Random Forest classifier achieving ~90% accuracy. Flask REST API with spatial indexing under 500ms. Interactive Leaflet.js map with Low/Medium/High risk visualization.",
        techStack: ["Python", "Flask", "GeoPandas", "Scikit-learn", "Leaflet.js"],
        category: "AI / GeoSpatial",
        order: 1,
        visible: true
      },
      {
        title: "My-Jewellery – E-Commerce Web App",
        description: "Responsive e-commerce platform with product catalogue, category filtering, and shopping cart with persistent state. Mobile-first UI built from scratch with clean separation of concerns.",
        techStack: ["JavaScript", "HTML", "CSS", "Node.js"],
        category: "Web App",
        order: 2,
        visible: true
      },
      {
        title: "NLP Parsing Comparison – Benchmarking Study",
        description: "Systematic comparison of spaCy, NLTK, and Stanford NLP across multiple sentence structures. Produced visualizations and structured report for constituency and dependency parsing tasks.",
        techStack: ["Python", "spaCy", "NLTK", "Stanford NLP"],
        category: "ML / NLP",
        order: 3,
        visible: true
      },
      {
        title: "EventEase – Event Management Platform",
        description: "Full-stack event management app with real-time Firebase database for event creation, registration, and attendee tracking.",
        techStack: ["JavaScript", "HTML", "CSS", "Firebase"],
        category: "Web App",
        order: 4,
        visible: true
      }
    ]);
    console.log('Projects seeded.');

    // 6. Seed all Skills with proficiency levels
    const skillsData = [
      { name: "Python", category: "Languages", proficiency: 5 },
      { name: "JavaScript", category: "Languages", proficiency: 5 },
      { name: "C++", category: "Languages", proficiency: 4 },
      { name: "SQL", category: "Languages", proficiency: 4 },
      { name: "HTML5", category: "Languages", proficiency: 5 },
      { name: "CSS3", category: "Languages", proficiency: 5 },
      
      { name: "React.js", category: "Frontend", proficiency: 4 },
      { name: "Leaflet.js", category: "Frontend", proficiency: 4 },
      { name: "Vanilla JS", category: "Frontend", proficiency: 5 },
      { name: "Responsive Design", category: "Frontend", proficiency: 5 },
      
      { name: "Flask", category: "Backend", proficiency: 5 },
      { name: "Node.js", category: "Backend", proficiency: 4 },
      { name: "REST APIs", category: "Backend", proficiency: 5 },
      
      { name: "Scikit-learn", category: "Data & ML", proficiency: 4 },
      { name: "GeoPandas", category: "Data & ML", proficiency: 4 },
      { name: "NumPy", category: "Data & ML", proficiency: 4 },
      { name: "Pandas", category: "Data & ML", proficiency: 4 },
      { name: "Rasterio", category: "Data & ML", proficiency: 3 },
      
      { name: "MySQL", category: "Databases", proficiency: 4 },
      { name: "SQLite", category: "Databases", proficiency: 4 },
      { name: "Firebase", category: "Databases", proficiency: 4 },
      
      { name: "Git", category: "Tools", proficiency: 5 },
      { name: "GitHub", category: "Tools", proficiency: 5 },
      { name: "VS Code", category: "Tools", proficiency: 5 },
      { name: "Postman", category: "Tools", proficiency: 4 },
      { name: "Linux", category: "Tools", proficiency: 4 }
    ].map((s, i) => ({ ...s, order: i + 1, visible: true }));
    
    await Skill.insertMany(skillsData);
    console.log('Skills seeded.');

    // 7. Seed Timeline entry
    await Timeline.create({
      title: "B.Tech in Computer Science and Engineering",
      institution: "IIIT Dharwad · Dharwad, Karnataka",
      duration: "2023 – 2027",
      type: "Education",
      order: 1
    });
    console.log('Timeline seeded.');

    // 8. Log success and exit
    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
