import {
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';
import { IconType } from 'react-icons/lib';

interface SocialLink {
  title: string;
  href: string;
  icon: IconType;
}

export const socialLinks: SocialLink[] = [
  { title: 'GitHub',   href: 'https://github.com/tomyRomero',                     icon: FaGithub },
  { title: 'LinkedIn', href: 'https://www.linkedin.com/in/tomyromero/', icon: FaLinkedin },
];

// ── Personal Info ────────────────────────────────────────────────────────────
export const ME = {
  name:      'Tomy Romero Seas',
  title:     'Software Engineer 1',
  location:  'Jewett City, Connecticut',
  email:     'tomyfletcher99@hotmail.com',
  github:    'https://github.com/tomyRomero',
  linkedin:  'https://www.linkedin.com/in/tomyromero/',
  portfolio: 'https://tomyromero.vercel.app',
  bio: `Full-stack software engineer with roots in healthcare homecare and a builder's mindset. By day I architect backend, frontend and database systems — converting workflows into scalable solutions. By night I build for the future. UVI graduate. SQL nerd.`,
};


export const intro = `Full-stack software engineer specializing in ASP.NET Core, React, and SQL Server. Passionate about building scalable systems and clean user experiences.`;

export const about = `As a full-stack developer, I design, build, and maintain software solutions using React, C# .NET, and cloud services like AWS and Azure. My experience spans secure authentication systems, payment integrations, AI-powered applications, and efficient e-commerce platforms. Proficient in MySQL and MS SQL Server, I develop scalable, optimized databases. I leverage DevOps tools for CI/CD, ensuring reliable and maintainable software. Focused on delivering results, I embrace Agile workflows and cross-functional collaboration.`;

// ── Nav Links ────────────────────────────────────────────────────────────────
export const navLinks = [
  { title: 'About',      path: 'about' },
  { title: 'Experience', path: 'experience' },
  { title: 'Projects',   path: 'projects' },
  { title: 'Contact',    path: 'contact' },
];

// ── Skills (grouped for Skills window) ──────────────────────────────────────
export const skills: Record<string, string[]> = {
  'Languages':    ['C#', 'JavaScript/TypeScript', 'SQL', 'HTML/CSS'],
  'Backend':      ['ASP.NET Core', 'Web API', 'Entity Framework', 'Node.js'],
  'Frontend':     ['React', 'React Native', 'Next.js', 'Tailwind CSS'],
  'Data & Cloud': ['SQL Server', 'Azure', 'AWS'],
  'Tools':        ['Git', 'Docker', 'CI/CD', 'Agile', 'SSMS', 'VS Code', 'Visual Studio'],
};

// ── Home Page Pictures ───────────────────────────────────────────────────────
import tomy       from '../public/assets/tomyRomero.jpeg';
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

// ── Services ─────────────────────────────────────────────────────────────────
export const services = [
  { title: 'Frontend Developer', icon: '/assets/webdev_icon.png' },
  { title: 'Backend Developer',  icon: '/assets/backend.png' },
  { title: 'Dev Ops',            icon: '/assets/aws.svg.png' },
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
    projectIcon: '/assets/github.svg',
    image:       '/artifyme/details.png',
    description: 'Full-stack mobile app that transforms imaginative sketches into AI-generated images.',
    link:        'https://github.com/tomyRomero/artifyme',
  },
  {
    title:       'StoreOperations',
    emoji:       '🛒',
    tagline:     'E-commerce for customers & businesses',
    status:      'shipped' as const,
    year:        '2024',
    techStack:   'React, Next.js, AWS, Stripe',
    projectIcon: '/assets/storeOps-icon.svg',
    image:       '/storeOps/cart.png',
    description: 'Full-stack CRUD e-commerce platform featuring dual interfaces and Stripe payments.',
    link:        'https://github.com/tomyRomero/storeOps',
  },
  {
    title:       'Sparks',
    emoji:       '✨',
    tagline:     'AI-powered social media & real-time messaging',
    status:      'shipped' as const,
    year:        '2023',
    techStack:   'React, Next.js, WebSockets, AWS, SQL',
    projectIcon: '/assets/github.svg',
    image:       '/sparks/sparks-chats.png',
    description: 'AI-powered full-stack social media platform with real-time WebSocket messaging.',
    link:        'https://github.com/tomyRomero/sparks',
  },
  {
    title:       'iMovies',
    emoji:       '🎬',
    tagline:     'Collaborative movie content management',
    status:      'shipped' as const,
    year:        '2024',
    techStack:   'React, ASP.NET Core, SQL Server, Azure, OMDb API',
    projectIcon: '/assets/github.svg',
    image:       '/iMovies/imovieshome.png',
    description: 'Team-built CMS for managing movies with social features powered by the OMDb API.',
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
    description: `Sparks is an innovative social media application designed to help users explore, share, and interact with creative ideas. Built with React and Next.js, hosted on AWS using an RDS SQL database and S3 for image storage.`,
    features: [
      'Full CRUD operations for posts',
      'Real-time filtering and updates',
      'WebSocket-based real-time user messaging',
      'AI-driven post generation with customizable categories',
      'Dynamic user profiles with interaction insights',
      'Comprehensive search and pagination',
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
    description: `ArtifyMe is a powerful mobile application that enables users to transform sketches into high-quality images using AI. Features a React Native interface, ASP.NET backend for secure auth, and FastAPI image generation with Stable Diffusion.`,
    features: [
      'Sketch-to-image AI-powered conversion',
      'Secure authentication with JWT',
      'Cloud storage with Amazon S3',
      'User-friendly UI/UX with pagination and dark mode',
      'Data management with SQL Server',
      'Seamless React Native mobile experience',
      'Integration with Stable Diffusion AI model',
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
    description: `StoreOperations is a robust e-commerce platform for online shopping. Built with Next.js, Stripe for payment processing, real-time email notifications via nodemailer, and Amazon S3 for image storage.`,
    features: [
      'Product and category management (CRUD)',
      'Cart functionality and Stripe payment processing',
      'User authentication and order management',
      'Admin panel for comprehensive business operations',
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
    description: `Contributed to both frontend and backend development for a comprehensive CMS for movie enthusiasts. Used ASP.NET Core, Entity Framework Core, SQL Server, and React for a full-featured movie management system.`,
    features: [
      'Content management for movie collections',
      'User authentication with JWT',
      'Responsive UI/UX',
      'Integration with OMDb API for rich movie metadata',
      'CRUD operations for managing user movie lists',
      'Social features: movie sharing, liking, top-rated movies',
      'Secure data management with Azure SQL Server',
      'Unit testing with xUnit and Jest',
    ],
    livelink:   '',
    githubrepo: 'https://github.com/240708-NET-FS/Project2_OMDb_API_Movies_CMS_Group1',
    year:       '2024',
    isLive:     false,
  },
];

// ── Technologies (icon grid) ─────────────────────────────────────────────────
import javascript from '../public/assets/javascript.png';
import html       from '../public/assets/html.png';
import docker     from '../public/assets/docker.png';
import git        from '../public/assets/git.png';
import css        from '../public/assets/css.png';
import reactjs    from '../public/assets/reactjs.png';
import typescript from '../public/assets/typescript.png';
import sqlserver  from '../public/assets/MSSQLServer.png';
import next       from '../public/assets/next-js.svg';
import azure      from '../public/assets/azure.png';
import dotnet     from '../public/assets/dotnet.png';
import aws        from '../public/assets/aws.svg.png';

export const technologies = [
  { name: 'HTML 5',              icon: html.src },
  { name: 'CSS 3',               icon: css.src },
  { name: 'JavaScript',          icon: javascript.src },
  { name: 'TypeScript',          icon: typescript.src },
  { name: 'React JS',            icon: reactjs.src },
  { name: '.NET',                icon: dotnet.src },
  { name: 'Azure',               icon: azure.src },
  { name: 'Git',                 icon: git.src },
  { name: 'Docker',              icon: docker.src },
  { name: 'SQL Server',          icon: sqlserver.src },
  { name: 'Next.js',             icon: next.src },
  { name: 'Amazon Web Services', icon: aws.src },
];

// ── Experiences ──────────────────────────────────────────────────────────────
export const experiences = [
  {
    title:   'Software Engineer 1',
    company: 'MEDsys Software Solutions',
    logo:    '🏥',
    date:    'April 2025 – Present',
    location: 'Remote · Connecticut',
    description: [
      'Architect and maintain full-stack features for a home-care healthcare management system.',
      'Design complex SQL Server migrations and integrate JavaScript logic into workflows.',
      'Work with C# ASP.NET Core, SQL Server, and SSMS in a DevOps-driven environment.',
      'Collaborate with business to translate requirements into scalable solutions.',
    ],
    tech: ['C# .NET', 'SQL Server', 'JavaScript', 'ASP.NET Core', 'SSMS'],
  },
  {
    title:    'Software Developer Intern',
    company:  'LocalChef',
    logo:     '🍽️',
    date:     'January 2025 – April 2025',
    location: 'Remote',
    description: [
      'Developed and maintained features using React, Java Spring Boot, AWS, and MySQL.',
      'Implemented secure authentication flows and Stripe payment integration.',
      'Built intuitive UX in a fast-paced Agile startup environment.',
    ],
    tech: ['React', 'Java Spring Boot', 'AWS', 'MySQL', 'Stripe'],
  },
  {
    title:    'Software Developer Trainee',
    company:  'Revature',
    logo:     '🏢',
    date:     'June 2024 – September 2024',
    location: 'Remote',
    description: [
      'Trained in C# .NET, React, MS SQL Server, and DevOps methodologies.',
      'Ensured code quality through unit testing and structured version control.',
      'Gained proficiency in cloud services, CI/CD pipelines, and containerization.',
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
    logo:        '🎓',
    gpa:         '3.11',
    bullets: [
      'Student Gonvernment Assocation Junior Senator',
      "Dean's List recipient — multiple semesters",
    ],
  },
];

// ── Contact ───────────────────────────────────────────────────────────────────
export const contactDetails = [
  { type: 'Email',    icon: '✉️', value: 'tomyfletcher99@hotmail.com',       href: 'mailto:tomyfletcher99@hotmail.com',            cv: 'tomyfletcher99@hotmail.com' },
  { type: 'LinkedIn', icon: '🔗', value: 'Tomy Romero Seas',                 href: 'https://www.linkedin.com/in/tomyromero/', cv: 'https://www.linkedin.com/in/tomyromero/' },
  { type: 'GitHub',   icon: '⑂',  value: 'github.com/tomyRomero',            href: 'https://github.com/tomyRomero',                cv: 'https://github.com/tomyRomero' },
  { type: 'Location', icon: '📍', value: 'Jewett City, Connecticut',     href: '',                                             cv: '' },
];

// ── About page highlight chips ────────────────────────────────────────────────
export const aboutChips = ['ASP.NET Core', 'React', 'SQL Server', 'Azure', 'Healthcare IT', 'SaaS Builder'];

// ── Open-to-work status ───────────────────────────────────────────────────────
export const openToWork = {
  active: true,
  label: 'Open to opportunities',
};

// ── Contact window CTA ────────────────────────────────────────────────────────
export const contactCTA = '✉️  Send me an email';

// ── Mobile footer line ────────────────────────────────────────────────────────
export const footerLine = 'Built with Next.js';

// ── Spotlight / search descriptions for each window ──────────────────────────
export const windowDescriptions: Record<string, string> = {
  about:      'Bio, photos, links',
  projects:   'Shipped work',
  experience: 'Work history',
  skills:     'Tech stack',
  contact:    'Get in touch',
};
