// ── Personal Info ────────────────────────────────────────────────────────────
export const ME = {
  name:      'Tomy Romero Seas',
  title:     'Software Engineer',
  location:  'Jewett City, Connecticut',
  email:     'tomyfletcher99@hotmail.com',
  github:    'https://github.com/tomyRomero',
  linkedin:  'https://www.linkedin.com/in/tomyromero/',
  portfolio: 'https://tomyromero.vercel.app',
  bio: `Full-stack engineer building home care software at MEDsys. I work across C#/.NET services, React frontends, and the SQL Server schemas underneath scheduling, billing, and authorizations. Nights and weekends I ship my own projects end to end. UVI graduate. SQL nerd.`,
};

// First year of professional software work — drives the "years" stats everywhere
export const CAREER_START = 2024;
export const yearsExperience = () =>
  `${Math.max(1, new Date().getFullYear() - CAREER_START)}+`;

// ── Skills (grouped for Skills window) ──────────────────────────────────────
export const skills: Record<string, string[]> = {
  'Languages':    ['C#', 'JavaScript/TypeScript', 'SQL', 'HTML/CSS'],
  'Backend':      ['ASP.NET Core', 'Web API', 'Entity Framework', 'Node.js'],
  'Frontend':     ['React', 'React Native', 'Next.js', 'Tailwind CSS'],
  'Data & Cloud': ['SQL Server', 'Azure', 'AWS'],
  'Tools':        ['Git', 'Docker', 'CI/CD', 'Agile', 'SSMS', 'VS Code', 'Visual Studio'],
};

export const totalSkills = Object.values(skills).flat().length;

// ── Home Page Pictures ───────────────────────────────────────────────────────
import tomy       from '../public/assets/tomyRomeroGrad.jpeg';
import uvi        from '../public/assets/uvi.jpeg';
import president  from '../public/assets/presidentUvi.jpeg';
import deanslist  from '../public/assets/deanslist.jpeg';
import scholarship from '../public/assets/scholarship.jpeg';
import uvilogo    from '../public/assets/uvi_icon.webp';
import sga        from '../public/assets/sga.jpeg';
import newyork    from '../public/assets/newyork.jpg';
import rhodeisland from '../public/assets/rhodeisland.jpg';
import fall       from '../public/assets/picnic.jpg';

export const profilePhoto = tomy;

export const images = [
  { img: tomy,         title: 'Tomy Romero',                                              alt: 'Picture of Tomy Romero smiling' },
  { img: uvi,          title: 'University of the Virgin Islands',                         alt: 'University of the Virgin Islands' },
  { img: president,    title: 'Picture with President of UVI',                            alt: 'Picture with President of University of the Virgin Islands' },
  { img: newyork,      title: 'New York City',                                            alt: 'Picture of New York City' },
  { img: deanslist,    title: "Dean's List Reception",                                    alt: "Dean's List Reception" },
  { img: fall,         title: 'Fall Picnic',                                              alt: 'Fall Picnic' },
  { img: rhodeisland,  title: 'Rhode Island',                                             alt: 'Picture of Rhode Island' },
  { img: scholarship,  title: 'Scholarship Award',                                        alt: 'Scholarship Reception' },
  { img: uvilogo,      title: 'University Logo',                                          alt: 'UVI Logo' },
  { img: sga,          title: 'Student Government Association Junior Senator',             alt: 'Tomy Romero as SGA Junior Senator' },
];

// ── Projects (list view) ─────────────────────────────────────────────────────
export const projects = [
  {
    title:       'ArtifyMe',
    emoji:       '🎨',
    tagline:     'Transform sketches into AI-generated art',
    status:      'shipped' as const,
    year:        '2024',
    techStack:   'React Native, ASP.NET Core, SQL Server, FastAPI, AWS',
    image:       '/artifyme/details.png',
    description: 'Mobile app that turns hand-drawn sketches into AI-generated images with Stable Diffusion.',
    link:        'https://github.com/tomyRomero/artifyme',
  },
  {
    title:       'StoreOperations',
    emoji:       '🛒',
    tagline:     'E-commerce for customers & businesses',
    status:      'shipped' as const,
    year:        '2024',
    techStack:   'React, Next.js, AWS, Stripe',
    image:       '/storeOps/cart.png',
    description: 'E-commerce store with Stripe checkout and a full admin back office.',
    link:        'https://github.com/tomyRomero/storeOps',
  },
  {
    title:       'Sparks',
    emoji:       '✨',
    tagline:     'AI-powered social media & real-time messaging',
    status:      'shipped' as const,
    year:        '2023',
    techStack:   'React, Next.js, WebSockets, AWS, SQL',
    image:       '/sparks/sparks-chats.png',
    description: 'Social platform with AI-assisted posts and real-time WebSocket messaging.',
    link:        'https://github.com/tomyRomero/sparks',
  },
  {
    title:       'iMovies',
    emoji:       '🎬',
    tagline:     'Collaborative movie content management',
    status:      'shipped' as const,
    year:        '2024',
    techStack:   'React, ASP.NET Core, SQL Server, Azure, OMDb API',
    image:       '/iMovies/imovieshome.png',
    description: 'Team-built movie CMS with social features, backed by the OMDb API.',
    link:        'https://github.com/240708-NET-FS/Project2_OMDb_API_Movies_CMS_Group1',
  },
];

// ── Project Details (full detail view) ──────────────────────────────────────
export const projectDetails = [
  {
    title:       'Sparks',
    type:        'Full Stack CRUD Social Media App',
    tools: [
      '/assets/sql.png', '/assets/next.webp', '/assets/reactjs.png',
      '/assets/tailwind.png', '/assets/typescript.png', '/assets/s3.svg',
      '/assets/rds.webp', '/assets/pusher.png',
    ],
    images: [
      '/sparks/sparks-login.png', '/sparks/sparks-home.png',
      '/assets/sparks-home-moblie.png', '/sparks/sparks-studio.png',
      '/sparks/sparks-chats.png', '/sparks/editSpark.png',
      '/sparks/sparks-noti.png', '/sparks/sparks-profile.png',
      '/sparks/sparks-message.png', '/sparks/sparks-post.png',
      '/sparks/sparks-share.png', '/sparks/sparks-search.png',
      '/sparks/sparks-search-post.png', '/sparks/movieSpark.png',
      '/sparks/novelSpark.png',
    ],
    description: `Sparks is a social platform for exploring and sharing creative ideas. Write posts yourself or draft them with AI, chat in real time, and dig through everything with search. Built with React and Next.js on AWS, using RDS for the SQL database, S3 for image storage, and Pusher for messaging.`,
    features: [
      'Full CRUD operations for posts',
      'Real-time filtering and updates',
      'WebSocket-based real-time user messaging',
      'AI-driven post generation with customizable categories',
      'User profiles with interaction insights',
      'Search with pagination across posts',
    ],
    livelink:   'https://sparkify.vercel.app/',
    githubrepo: 'https://github.com/tomyRomero/sparks',
    year:       '2023',
    isLive:     true,
  },
  {
    title: 'ArtifyMe',
    type:  'Full Stack CRUD Mobile App',
    tools: [
      '/assets/typescript.png', '/assets/s3.svg', '/assets/dotnet.png',
      '/assets/reactjs.png', '/assets/fastapi.png', '/assets/expo.png',
      '/assets/sql.png',
    ],
    images: [
      '/artifyme/details.png', '/artifyme/canvas.png', '/artifyme/colorpicker.png',
      '/artifyme/home.png', '/artifyme/homedark.png', '/artifyme/login.png',
      '/artifyme/signup.png', '/artifyme/about.png', '/artifyme/profile.png',
      '/artifyme/profiledark.png', '/artifyme/create.png', '/artifyme/results.png',
    ],
    description: `ArtifyMe turns hand-drawn sketches into AI-generated images. Draw on the in-app canvas, pick your palette, and Stable Diffusion does the rest. React Native on the front end, an ASP.NET Core API handling JWT auth, and a FastAPI service running image generation. S3 handles storage and SQL Server holds the data.`,
    features: [
      'Sketch-to-image conversion on an in-app drawing canvas',
      'Secure authentication with JWT',
      'Cloud storage with Amazon S3',
      'Dark mode and paginated artwork lists',
      'Stable Diffusion image generation via FastAPI',
    ],
    livelink:   'https://github.com/tomyRomero/artifyme',
    githubrepo: 'https://github.com/tomyRomero/artifyme',
    year:       '2024',
    isLive:     false,
  },
  {
    title: 'StoreOperations',
    type:  'Full Stack CRUD E-Commerce Platform',
    tools: [
      '/assets/reactjs.png', '/assets/next.webp', '/assets/typescript.png',
      '/assets/mongodb.png', '/assets/s3.svg', '/assets/nextauth.png',
      '/assets/stripe.svg',
    ],
    images: [
      '/storeOps/home.png', '/storeOps/mobliehome.png', '/storeOps/promotions.png',
      '/storeOps/footer.png', '/storeOps/products.png', '/storeOps/productdetails.png',
      '/storeOps/cart.png', '/storeOps/checkout.png', '/storeOps/search.png',
      '/storeOps/login.png', '/storeOps/accountorderdetails.png',
      '/storeOps/accountorders.png', '/storeOps/accountaddresses.png',
      '/storeOps/privacyPolicy.png', '/storeOps/address.png',
      '/storeOps/ordersuccess.png', '/storeOps/activity.png',
      '/storeOps/adminproducts.png', '/storeOps/editproduct.png',
      '/storeOps/mobileadmin.png', '/storeOps/adminusers.png',
      '/storeOps/adminuserdetails.png', '/storeOps/adminmakedeal.png',
      '/storeOps/newsletter.png', '/storeOps/admincategories.png',
      '/storeOps/editcategory.png', '/storeOps/adminorders.png',
    ],
    description: `StoreOperations is an e-commerce platform with two sides: a storefront with cart, Stripe checkout, and order tracking for customers, and an admin back office for products, categories, deals, and newsletters. Built with Next.js, with email notifications via nodemailer and S3 image storage.`,
    features: [
      'Product and category management (CRUD)',
      'Cart functionality and Stripe payment processing',
      'User authentication and order management',
      'Admin panel for products, orders, users, and deals',
      'Responsive design with pagination, filtering, and search',
      'Detailed analytics and reporting',
    ],
    livelink:   'https://palettehub.vercel.app/',
    githubrepo: 'https://github.com/tomyRomero/storeOps',
    year:       '2024',
    isLive:     true,
  },
  {
    title: 'iMovies',
    type:  'Full Stack CRUD Content Management System',
    tools: [
      '/assets/reactjs.png', '/assets/sql.png',
      '/assets/dotnet.png',  '/assets/azure.png',
    ],
    images: [
      '/iMovies/login.png', '/iMovies/imovieshome.png',
      '/iMovies/usermovielist.png', '/iMovies/addmovie.png',
      '/iMovies/moviemodal.png', '/iMovies/signup.png', '/iMovies/profile.png',
    ],
    description: `A team-built CMS for movie fans: search titles through the OMDb API, manage personal movie lists, and share, like, and rank favorites. ASP.NET Core and Entity Framework on the backend, React on the front, deployed on Azure. I worked across both the API and the UI.`,
    features: [
      'Content management for movie collections',
      'User authentication with JWT',
      'Integration with OMDb API for rich movie metadata',
      'CRUD operations for managing user movie lists',
      'Social features: movie sharing, liking, top-rated movies',
      'Azure-hosted SQL Server database',
      'Unit testing with xUnit and Jest',
    ],
    livelink:   '',
    githubrepo: 'https://github.com/240708-NET-FS/Project2_OMDb_API_Movies_CMS_Group1',
    year:       '2024',
    isLive:     false,
  },
];

// ── Experiences ──────────────────────────────────────────────────────────────
export const experiences = [
  {
    title:   'Software Engineer',
    company: 'MEDsys Software Solutions',
    logo:    'M',
    date:    'April 2025 – Present',
    location: 'Remote · Connecticut',
    description: [
      'Build, maintain, and debug full-stack features for a home care management system.',
      'Design and optimize SQL Server data models and complex queries behind scheduling, billing, authorization, and reporting workflows.',
      'Ship features end to end with C#, ASP.NET Core, and JavaScript in a DevOps-driven environment.',
      'Work directly with business stakeholders to scope requirements and deliver new features.',
    ],
    tech: ['C# .NET', 'SQL Server', 'JavaScript', 'ASP.NET Core', 'SSMS'],
  },
  {
    title:    'Software Developer Intern',
    company:  'LocalChef',
    logo:     'LC',
    date:     'January 2025 – April 2025',
    location: 'Remote',
    description: [
      'Built and maintained full-stack features with React, Java Spring Boot, and MySQL on AWS.',
      'Implemented secure authentication flows and Stripe payment integration.',
      'Worked alongside senior engineers in a small, fast-moving startup team.',
    ],
    tech: ['React', 'Java Spring Boot', 'AWS', 'MySQL', 'Stripe'],
  },
  {
    title:    'Software Developer Trainee',
    company:  'Revature',
    logo:     'R',
    date:     'June 2024 – September 2024',
    location: 'Remote',
    description: [
      'Completed intensive full-stack training in C#/.NET, React, SQL Server, and DevOps practices.',
      'Built enterprise-style team applications with unit testing and structured version control.',
      'Worked with cloud services, CI/CD pipelines, and containerization.',
    ],
    tech: ['C# .NET', 'React', 'MS SQL Server', 'Docker', 'CI/CD'],
  },
];

// ── Education ─────────────────────────────────────────────────────────────────
export const education = [
  {
    institution: 'University of the Virgin Islands',
    degree:      'Bachelor of Science',
    field:       'Computer Science',
    period:      'Graduated 2023',
    location:    'U.S. Virgin Islands',
    logo:        'UVI',
    gpa:         '3.11',
    bullets: [
      'Student Government Association Junior Senator',
      "Dean's List recipient for multiple semesters",
    ],
  },
];

// ── Certifications ────────────────────────────────────────────────────────────
export const certifications = [
  {
    name:         'AWS Cloud Quest: Cloud Practitioner',
    issuer:       'Amazon Web Services (AWS)',
    logo:         'AWS',
    issued:       'Apr 2026',
    credentialId: null,
    url:          'https://www.credly.com/badges/a3e1cf34-d475-4f11-a3a9-fd19e0038af7/public_url',
  },
  {
    name:         'Microsoft SQL Server Specialization',
    issuer:       'Microsoft',
    logo:         'MS',
    issued:       'Feb 2026',
    credentialId: '7SIMAY3OEGQN',
    url:          'https://www.coursera.org/account/accomplishments/specialization/7SIMAY3OEGQN',
  },
  {
    name:         'AWS Academy Cloud Foundations',
    issuer:       'Amazon Web Services (AWS)',
    logo:         'AWS',
    issued:       'Sep 2022',
    credentialId: null,
    url:          'https://www.credly.com/badges/49f35d3b-7ea8-40ee-afde-77c8e7725827',
  },
];

// ── Contact ───────────────────────────────────────────────────────────────────
export const contactDetails = [
  { type: 'Email',    icon: '✉️', value: 'tomyfletcher99@hotmail.com',       href: 'mailto:tomyfletcher99@hotmail.com',            cv: 'tomyfletcher99@hotmail.com' },
  { type: 'LinkedIn', icon: '🔗', value: 'Tomy Romero Seas',                 href: 'https://www.linkedin.com/in/tomyromero/', cv: 'https://www.linkedin.com/in/tomyromero/' },
  { type: 'GitHub',   icon: '⑂',  value: 'github.com/tomyRomero',            href: 'https://github.com/tomyRomero',                cv: 'https://github.com/tomyRomero' },
  { type: 'Location', icon: '📍', value: 'Jewett City, Connecticut',     href: '',                                             cv: '' },
];

// Shared intro line for the Contact window and mobile contact section
export const contactBlurb =
  'Hiring for a full-stack role, or just want to talk shop about .NET, React, or SQL? My inbox is open, and email is the fastest way to reach me.';

// ── About page highlight chips ────────────────────────────────────────────────
export const aboutChips = ['ASP.NET Core', 'React', 'SQL Server', 'Azure', 'Home Care Tech', 'SaaS Builder'];
