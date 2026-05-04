/**
 * SINGLE SOURCE OF TRUTH for all portfolio projects.
 * Both Hero.jsx (for the count) and Projects.jsx (for the cards) import from here.
 * To add a new project, just add an entry to this array — the hero count updates automatically.
 */

export const FALLBACK_PROJECTS = [
  {
    _id: 'fallback-1',
    title: 'GeoSafe AI',
    description: 'AI-powered geospatial risk assessment system achieving ~90% accuracy using satellite imagery, machine learning pipelines, and interactive mapping.',
    techStack: ['TypeScript', 'Scikit-learn', 'GeoPandas', 'React', 'Flask'],
    badge: 'AI / GEOSPATIAL',
    image: '/projects/geosafe.png',
    github: 'https://github.com/abdulsami-S/GeoSafe-AI',
  },
  {
    _id: 'fallback-2',
    title: 'My-Jewellery',
    description: 'Full-featured e-commerce web application with product catalog, cart system, user authentication, and responsive design.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Express'],
    badge: 'WEB APP',
    image: '/projects/jewellery.png',
    github: 'https://github.com/abdulsami-S/My-Jewellery',
  },
  {
    _id: 'fallback-3',
    title: 'NLP Benchmark',
    description: 'Comparative analysis of 3 NLP libraries — NLTK, spaCy, and Hugging Face — across sentiment analysis, NER, and text classification.',
    techStack: ['Python', 'NLTK', 'spaCy', 'Transformers'],
    badge: 'ML / NLP',
    image: '/projects/nlp.png',
    github: 'https://github.com/abdulsami-S/nlp-parsing-comparison',
  },
  {
    _id: 'fallback-4',
    title: 'EventEase',
    description: 'Real-time event management platform with live updates, collaborative planning tools, and seamless RSVP tracking.',
    techStack: ['React', 'Firebase', 'Node.js', 'JavaScript'],
    badge: 'WEB APP',
    image: '/projects/eventease.png',
    github: 'https://github.com/abdulsami-S/eventease',
  },
  {
    _id: 'fallback-5',
    title: 'Smart-Folio',
    description: 'This very portfolio — a premium personal portfolio website with GSAP animations, MERN stack backend, admin dashboard, and a dynamic content management system.',
    techStack: ['React', 'GSAP', 'Node.js', 'MongoDB', 'Vite'],
    badge: 'PORTFOLIO',
    image: '/projects/smartfolio.png',
    github: 'https://github.com/abdulsami-S/smart-folio',
  },
];
