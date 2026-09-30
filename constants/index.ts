// Personal info
export const ME = {
  name:      'Tomy F. Romero',
  title:     'Full-Stack Software Engineer',
  location:  'Ocala, Florida',
  email:     'tomyfletcher99@hotmail.com',
  github:    'https://github.com/tomyRomero',
  linkedin:  'https://www.linkedin.com/in/tomyromero/',
  portfolio: 'https://tomyromero.vercel.app',
  bio: `Full-stack engineer building home care software at MEDsys. I work across C#/.NET services, React frontends, and the SQL Server work behind scheduling, billing, and authorizations, and I like asking the right questions to get to the root of what's needed. Nights and weekends I ship my own projects end to end. UVI graduate, bilingual in English and Spanish. SQL nerd.`,
};

export const resumeFile = {
  href:     '/Tomy_Romero_Resume_Public.pdf',
  filename: 'Tomy_Romero_Resume.pdf',
};

// Used for the years-of-experience stats
export const CAREER_START = 2024;
export const yearsExperience = () =>
  `${Math.max(1, new Date().getFullYear() - CAREER_START)}+`;

// Skills
export const skills: Record<string, string[]> = {
  'Languages':    ['C#', 'JavaScript/TypeScript', 'SQL', 'HTML/CSS'],
  'Backend':      ['ASP.NET Core', 'REST APIs', 'API Design', 'Entity Framework', 'Node.js'],
  'Frontend':     ['React', 'React Native', 'Next.js', 'Tailwind CSS'],
  'Data & Cloud': ['SQL Server', 'MySQL', 'Azure', 'AWS'],
  'Tools':        ['Git', 'Docker', 'CI/CD', 'Unit Testing', 'Agile', 'Jira', 'Confluence', 'SSMS', 'Visual Studio'],
};

export const totalSkills = Object.values(skills).flat().length;

// Where each skill was used: roles by company short name, projects by title
export const skillUse: Record<string, { at?: string[]; in?: string[] }> = {
  'C#':                    { at: ['MEDsys', 'Revature'],              in: ['ArtifyMe', 'iMovies'] },
  'JavaScript/TypeScript': { at: ['MEDsys'],                          in: ['ArtifyMe', 'StoreOperations', 'Sparks', 'iMovies'] },
  'SQL':                   { at: ['MEDsys', 'LocalChef', 'Revature'], in: ['ArtifyMe', 'Sparks', 'iMovies'] },
  'HTML/CSS':              {                                          in: ['StoreOperations', 'Sparks', 'iMovies'] },
  'ASP.NET Core':          { at: ['MEDsys'],                          in: ['ArtifyMe', 'iMovies'] },
  'REST APIs':             {                                          in: ['ArtifyMe', 'iMovies'] },
  'API Design':            {                                          in: ['ArtifyMe', 'iMovies'] },
  'Entity Framework':      {                                          in: ['iMovies'] },
  'Node.js':               {                                          in: ['StoreOperations', 'Sparks'] },
  'React':                 { at: ['MEDsys', 'LocalChef', 'Revature'], in: ['StoreOperations', 'Sparks', 'iMovies'] },
  'React Native':          {                                          in: ['ArtifyMe'] },
  'Next.js':               {                                          in: ['StoreOperations', 'Sparks'] },
  'Tailwind CSS':          {                                          in: ['Sparks'] },
  'SQL Server':            { at: ['MEDsys', 'Revature'],              in: ['ArtifyMe', 'iMovies'] },
  'MySQL':                 { at: ['LocalChef'] },
  'Azure':                 {                                          in: ['iMovies'] },
  'AWS':                   { at: ['LocalChef'],                       in: ['ArtifyMe', 'StoreOperations', 'Sparks'] },
  'Git':                   {                                          in: ['ArtifyMe', 'StoreOperations', 'Sparks', 'iMovies'] },
  'Docker':                { at: ['Revature'] },
  'CI/CD':                 { at: ['Revature'] },
  'Unit Testing':          { at: ['Revature'],                        in: ['iMovies'] },
  'Agile':                 { at: ['MEDsys', 'Revature'] },
  'Jira':                  { at: ['MEDsys'] },
  'Confluence':            { at: ['MEDsys'] },
};

// About photos
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

// Project screenshots
// Generated by scripts/project-images.mjs from public/projects/<title>/.
// The first file is the card image.
import projectImages from './projectImages.json';

// framed: the image already includes its device (see-through corners)
// vivid: colorful enough to crop edge to edge (the Photos widget uses these)
export type Shot = { src: string; w: number; h: number; framed?: boolean; vivid?: boolean };
export const projectSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
export const shotsFor = (title: string): Shot[] =>
  (projectImages as Record<string, Shot[]>)[projectSlug(title)] ?? [];
// Phone screenshots get a blurred backdrop instead of being cropped
export const isTallShot = (s?: Shot) => !!s && s.h > s.w * 1.15;
// "07-product-details.png" → "Product details"
export const shotLabel = (s: Shot) => {
  const name = s.src.split('/').pop()!.replace(/\.[a-z]+$/i, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ');
  return name.charAt(0).toUpperCase() + name.slice(1);
};

// Projects
export const projects = [
  {
    title:       'ArtifyMe',
    platform:    'mobile' as 'web' | 'mobile',
    emoji:       '🎨',
    tagline:     'Transform sketches into AI-generated art',
    status:      'shipped' as const,
    year:        '2024',
    techStack:   'React Native, ASP.NET Core, SQL Server, FastAPI, AWS',
    description: 'Mobile app that turns hand-drawn sketches into AI-generated images with Stable Diffusion.',
    link:        'https://github.com/tomyRomero/artifyme',
  },
  {
    title:       'StoreOperations',
    platform:    'web' as 'web' | 'mobile',
    emoji:       '🛒',
    tagline:     'E-commerce for customers & businesses',
    status:      'shipped' as const,
    year:        '2024',
    techStack:   'React, Next.js, AWS, Stripe',
    description: 'E-commerce store with Stripe checkout and a full admin back office.',
    link:        'https://github.com/tomyRomero/StoreOperations',
  },
  {
    title:       'Sparks',
    platform:    'web' as 'web' | 'mobile',
    emoji:       '✨',
    tagline:     'AI-powered social media & real-time messaging',
    status:      'shipped' as const,
    year:        '2023',
    techStack:   'React, Next.js, WebSockets, AWS, SQL',
    description: 'Social platform with AI-assisted posts and real-time WebSocket messaging.',
    link:        'https://github.com/tomyRomero/sparks',
  },
  {
    title:       'iMovies',
    platform:    'web' as 'web' | 'mobile',
    emoji:       '🎬',
    tagline:     'Collaborative movie content management',
    status:      'shipped' as const,
    year:        '2024',
    techStack:   'React, ASP.NET Core, SQL Server, Azure, OMDb API',
    description: 'Team-built movie CMS with social features, backed by the OMDb API.',
    link:        'https://github.com/240708-NET-FS/Project2_OMDb_API_Movies_CMS_Group1',
  },
].map(p => ({ ...p, cover: shotsFor(p.title)[0] ?? null, image: shotsFor(p.title)[0]?.src ?? null }));

// Project details
// isLive shows the Live Demo buttons
export const projectDetails = [
  {
    title:       'Sparks',
    type:        'Full Stack CRUD Social Media App',
    tools: [
      '/assets/sql.png', '/assets/next.webp', '/assets/reactjs.png',
      '/assets/tailwind.png', '/assets/typescript.png', '/assets/s3.svg',
      '/assets/rds.webp', '/assets/pusher.png',
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
    isLive:     false,
  },
  {
    title: 'ArtifyMe',
    type:  'Full Stack CRUD Mobile App',
    tools: [
      '/assets/typescript.png', '/assets/s3.svg', '/assets/dotnet.png',
      '/assets/reactjs.png', '/assets/fastapi.png', '/assets/expo.png',
      '/assets/sql.png',
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
    githubrepo: 'https://github.com/tomyRomero/StoreOperations',
    year:       '2024',
    isLive:     false,
  },
  {
    title: 'iMovies',
    type:  'Full Stack CRUD Content Management System',
    tools: [
      '/assets/reactjs.png', '/assets/sql.png',
      '/assets/dotnet.png',  '/assets/azure.png',
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
].map(p => ({ ...p, images: shotsFor(p.title).map(x => x.src) }));

// Experience
// tint picks each organization's color (components/mac/Native.tsx); start
// and end are 'YYYY-MM' and drive the timeline, end null means current.
export type Tint = 'teal' | 'orange' | 'violet' | 'blue' | 'amber';

export const experiences: {
  title: string; company: string; short: string; logo: string; tint: Tint;
  start: string; end: string | null; date: string; location: string;
  description: string[]; tech: string[];
}[] = [
  {
    title:   'Software Engineer I',
    company: 'MEDsys Software Solutions',
    short:   'MEDsys',
    logo:    'M',
    tint:    'teal' as Tint,
    start:   '2025-04',
    end:     null,
    date:    'April 2025 – Present',
    location: 'Remote',
    description: [
      'Develop and maintain full-stack features for a HIPAA-compliant platform serving multiple home care agencies, using C#, ASP.NET, JavaScript, and SQL Server.',
      'Build and enhance reporting tools, data entry forms, and billing and invoicing workflows for operational teams.',
      'Resolve production support tickets and bugs, working with QA to find root causes and propose solutions.',
      'Work with business stakeholders to turn operational needs into features, in an Agile environment using Jira and Confluence.',
    ],
    tech: ['C# .NET', 'SQL Server', 'JavaScript', 'ASP.NET Core', 'Jira'],
  },
  {
    title:    'Software Developer Intern',
    company:  'LocalChef',
    short:    'LocalChef',
    logo:     'LC',
    tint:     'orange' as Tint,
    start:    '2025-01',
    end:      '2025-04',
    date:     'January 2025 – April 2025',
    location: 'Remote',
    description: [
      'Developed features for a startup product as part of a small, fast-paced engineering team.',
      'Helped build user authentication and payment integration for the platform.',
    ],
    tech: ['React', 'AWS', 'MySQL', 'Stripe'],
  },
  {
    title:    'Software Developer Trainee',
    company:  'Revature',
    short:    'Revature',
    logo:     'R',
    tint:     'violet' as Tint,
    start:    '2024-06',
    end:      '2024-09',
    date:     'June 2024 – September 2024',
    location: 'Remote',
    description: [
      'Completed a structured Agile software development training program covering the full development lifecycle.',
      'Applied code quality practices including testing, continuous integration, and version control.',
    ],
    tech: ['C# .NET', 'React', 'MS SQL Server', 'Docker', 'CI/CD'],
  },
];

// Education
export const education = [
  {
    institution: 'University of the Virgin Islands',
    degree:      'Bachelor of Science',
    field:       'Computer Science',
    period:      'August 2018 – December 2022',
    location:    'St. Thomas, USVI',
    logo:        'UVI',
    tint:        'blue' as Tint,
    years:       '2018 – 2022',
    bullets: [
      'Student Government Association Junior Senator',
      "Dean's List recipient for multiple semesters",
    ],
  },
];

// Certifications
export const certifications = [
  {
    name:         'AWS Cloud Quest: Cloud Practitioner',
    issuer:       'Amazon Web Services (AWS)',
    logo:         'AWS',
    tint:         'amber' as Tint,
    issued:       'Apr 2026',
    credentialId: null,
    url:          'https://www.credly.com/badges/a3e1cf34-d475-4f11-a3a9-fd19e0038af7/public_url',
  },
  {
    name:         'Microsoft SQL Server Specialization',
    issuer:       'Microsoft',
    logo:         'MS',
    tint:         'blue' as Tint,
    issued:       'Feb 2026',
    credentialId: '7SIMAY3OEGQN',
    url:          'https://www.coursera.org/account/accomplishments/specialization/7SIMAY3OEGQN',
  },
  {
    name:         'AWS Academy Cloud Foundations',
    issuer:       'Amazon Web Services (AWS)',
    logo:         'AWS',
    tint:         'amber' as Tint,
    issued:       'Sep 2022',
    credentialId: null,
    url:          'https://www.credly.com/badges/49f35d3b-7ea8-40ee-afde-77c8e7725827',
  },
];

// Contact
export const contactDetails = [
  { type: 'Email',    icon: '✉️', value: 'tomyfletcher99@hotmail.com',       href: 'mailto:tomyfletcher99@hotmail.com',            cv: 'tomyfletcher99@hotmail.com' },
  { type: 'LinkedIn', icon: '🔗', value: 'Tomy F. Romero',                 href: 'https://www.linkedin.com/in/tomyromero/', cv: 'https://www.linkedin.com/in/tomyromero/' },
  { type: 'GitHub',   icon: '⑂',  value: 'github.com/tomyRomero',            href: 'https://github.com/tomyRomero',                cv: 'https://github.com/tomyRomero' },
  { type: 'Location', icon: '📍', value: 'Ocala, Florida',              href: '',                                             cv: '' },
];

export const contactBlurb =
  'Hiring for a full-stack role, or just want to talk shop about .NET, React, or SQL? My inbox is open, and email is the fastest way to reach me.';
