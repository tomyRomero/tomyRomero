
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";

// Define the structure of the social links
interface SocialLink {
  title: string;
  href: string;
  icon: IconType;
}

// Social links array with icons from react-icons
export const socialLinks: SocialLink[] = [
  { title: 'GitHub', href: 'https://github.com/yourusername', icon: FaGithub },
  { title: 'LinkedIn', href: 'https://www.linkedin.com/in/yourusername', icon: FaLinkedin },
];

//Home Page Pictures
import tomy from '../public/assets/tomyRomero.jpeg'
import uvi from '../public/assets/uvi.jpeg'
import president from '../public/assets/presidentUvi.jpeg'
import deanslist from '../public/assets/deanslist.jpeg'
import scholarship from '../public/assets/scholarship.jpeg'
import uvilogo from '../public/assets/uvi_icon.webp'
import sga from '../public/assets/sga.jpeg'
import newyork from '../public/assets/newyork.jpg'
import rhodeisland from '../public/assets/rhodeisland.jpg'
import fall from '../public/assets/picnic.jpg'

//Techs
import javascript from '../public/assets/javascript.png'
import html from '../public/assets/html.png'
import docker from '../public/assets/docker.png'
import git from '../public/assets/git.png'
import css from '../public/assets/css.png'
import reactjs from '../public/assets/reactjs.png'
import typescript from '../public/assets/typescript.png'
import sqlserver from '../public/assets/MSSQLServer.png'
import next from '../public/assets/next-js.svg'
import azure from '../public/assets/azure.png'
import dotnet from '../public/assets/dotnet.png'
import aws from '../public/assets/aws.svg.png'


export const resumeLink = `https://docs.google.com/document/d/1NgKOp9uVqTW2ntBhMemJ5E-mporMj0cH9h6Cnki2nWA/edit?usp=sharing`;

export const intro = `I’m an enthusiastic Software Developer with hands-on experience in full-stack development. I’m passionate about building scalable applications, optimizing performance, and delivering reliable software that meets business needs. I thrive in collaborative, fast-paced environments where clear communication and teamwork drive high-quality results.`

export const about = `As a full-stack developer, I have designed, built, and maintained software solutions using React, C# .NET, and cloud services like AWS and Azure. My work includes secure authentication systems, seamless payment integrations, AI-powered applications, and efficient e-commerce platforms. Proficient in database management systems such as MySQL and MS SQL Server, I create scalable, optimized database solutions. I leverage DevOps tools for continuous integration and deployment, ensuring reliable and maintainable software. Focused on delivering results, I embrace Agile workflows and cross-functional collaboration to develop software that meets user needs and drives business success.`

//Links for Nav Menu
export const navLinks = [
  { title: 'About', path: 'about' },
  { title: 'Experience', path: 'experience' },
  { title: 'Projects', path: 'projects' },
  { title: 'Contact', path: 'contact' },
];

//Images for home page Photos.tsx
export const images = [
  { img: uvi, title: 'University of the Virgin Islands', alt: 'University of the Virgin Islands' },
  { img: president, title: 'Picture with President of University of the Virgin Islands', alt: 'Picture with President of University of the Virgin Islands' },
  {img: newyork, title: 'New York City', alt: 'Picture of New York City'},
  { img: deanslist, title: 'Deans List Reception', alt: 'Deans List Reception' },
  {img: fall, title: 'Fall Picnic', alt: 'Fall Picnic'},
  { img: tomy, title: 'tomyRomero', alt: 'picture of Tomy Romero smiling' },
  { img: rhodeisland, title: 'Rhode Island', alt: 'Picture of Rhode Island' },
  { img: scholarship, title: 'Scholarship Award winner', alt: 'Picture of ScholarShip Reception' },
  { img: uvilogo, title: 'University Logo', alt: 'Picture of UVI logo' },
  { img: sga, title: 'Student Government Association Junior Senator', alt: 'Picture of Tomy Romero as Student Government Association Junior Senator' }
]

//My services
export const services = [
  {
    title: "Frontend Developer",
    icon: '/assets/webdev_icon.png',
  },
  {
    title: "Backend Developer",
    icon: '/assets/backend.png',
  },
  {
    title: `Dev Ops`,
    icon: '/assets/aws.svg.png',
  }
];

//Projects for Home Page
export const projects = [
{
  title: "ArtifyMe",
  techStack: "React Native, ASP.NET Core, SQL Server, Fast API, AWS",
  projectIcon: '/assets/github.svg',
  image: "/artifyme/details.png",
  description: 'Full-stack CRUD mobile app, Transform imaginative sketches into AI-generated images.',
  link: "https://github.com/tomyRomero/artifyme"
},
  {
    title: "StoreOperations",
    techStack: 'React, Next.js, AWS, Stripe',
    projectIcon: '/assets/storeOps-icon.svg',
    image: '/storeOps/cart.png',
    description: 'Full-stack CRUD E-Commerce Platform for online shopping for customers and businesses.',
    link: "https://github.com/tomyRomero/storeOps"
  },
{
  title: "Sparks",
  techStack: 'React, Next.js, Web Sockets, AWS, SQL',
  projectIcon: '/assets/github.svg',
  image: '/sparks/sparks-chats.png',
  description: 'AI powered full stack CRUD social media platform and messaging application.',
  link: "https://github.com/tomyRomero/sparks"
},
{
  title: "iMovies",
  techStack: 'React, ASP.NET Core, SQL Server, Azure, OMDb API',
  projectIcon: '/assets/github.svg',
  image: '/iMovies/imovieshome.png',
  description: 'Contributed to a content management system as part of a collaborative team, that allows users to manage a list of movies with social media features.',
  link: "https://github.com/240708-NET-FS/Project2_OMDb_API_Movies_CMS_Group1",
},

]

//Projects in Detail
export const projectDetails = [
  {
    title: 'Sparks',
    type: 'Full Stack CRUD Social Media App',
    tools: [
      '/assets/sql.png',
      '/assets/next.webp',
      '/assets/reactjs.png',
      '/assets/tailwind.png',
      '/assets/typescript.png',
      '/assets/s3.svg',
      '/assets/rds.webp',
      '/assets/pusher.png'
    ],
    images: [
      '/sparks/sparks-login.png',
      '/sparks/sparks-home.png',
      '/assets/sparks-home-moblie.png',
      '/sparks/sparks-studio.png',
      '/sparks/sparks-chats.png',
      '/sparks/editSpark.png',
      '/sparks/sparks-noti.png',
      '/sparks/sparks-profile.png',
      '/sparks/sparks-message.png',
      '/sparks/sparks-post.png',
      '/sparks/sparks-share.png',
      '/sparks/sparks-search.png',
      '/sparks/sparks-search-post.png',
      '/sparks/movieSpark.png',
      '/sparks/novelSpark.png'
    ],
    description: `Sparks is an innovative social media application designed to help users explore, share, and interact with creative ideas. Built using the latest frontend techonologies such as React and Next, Sparks is hosted on Amazon Web Services using a RDS SQL database for database management and S3 for image storage.`,
    features: [
      'Full CRUD operations for posts',
      'Real-time filtering and updates',
      'Web socket-based real-time user messaging',
      'AI-driven post generation with customizable categories',
      'Dynamic user profiles with interaction insights',
      'Comprehensive search and pagination'
    ],
    livelink: 'https://sparkify.vercel.app/',
    githubrepo: 'https://github.com/tomyRomero/sparks',
    year: '2023',
    isLive: true,
  },
  {
    title: "ArtifyMe",
    type: "Full Stack CRUD Mobile App",
    tools: [
      '/assets/typescript.png',
      '/assets/s3.svg',
      '/assets/dotnet.png',
      '/assets/reactjs.png',
      '/assets/fastapi.png',
      '/assets/expo.png',
      '/assets/sql.png',
    ],
    images: [
      '/artifyme/details.png',
      '/artifyme/canvas.png',
      '/artifyme/colorpicker.png',
      '/artifyme/home.png',
      '/artifyme/homedark.png',
      '/artifyme/login.png',
      '/artifyme/signup.png',
      '/artifyme/about.png',
      '/artifyme/profile.png',
      '/artifyme/profiledark.png',
      '/artifyme/create.png',
      '/artifyme/results.png'
    ],
    description: `ArtifyMe is a powerful mobile application that enables users to transform sketches into high-quality images using AI technology. The app features a user-friendly React Native interface, an ASP.NET backend for secure authentication, and a FastAPI-powered image generation service integrated with the Stable Diffusion model.  Explore the README for comprehensive setup instructions and additional details.`,
    features: [
      'Sketch-to-image AI-powered conversion',
      'Secure authentication with JWT',
      'Cloud storage with Amazon S3',
      'User-friendly UI/UX with pagination and dark mode',
      'Data management with SQL Server',
      'Seamless React Native mobile experience',
      'Integration with Stable Diffusion AI model'
    ],
    livelink: 'https://github.com/tomyRomero/artifyme',
    githubrepo: 'https://github.com/tomyRomero/artifyme',
    year: '2024',
    isLive: false,
  },
  {
    title: 'StoreOperations',
    type: 'Full Stack CRUD E-Commerce Platform',
    tools: [
      '/assets/reactjs.png',
      '/assets/next.webp',
      '/assets/typescript.png',
      '/assets/mongodb.png',
      '/assets/s3.svg',
      '/assets/nextauth.png',
      '/assets/stripe.svg'
    ],
    images: [
      '/storeOps/home.png',
      '/storeOps/mobliehome.png',
      '/storeOps/promotions.png',
      '/storeOps/footer.png',
      '/storeOps/products.png',
      '/storeOps/productdetails.png',
      '/storeOps/cart.png',
      '/storeOps/checkout.png',
      '/storeOps/search.png',
      '/storeOps/login.png',
      '/storeOps/accountorderdetails.png',
      '/storeOps/accountorders.png',
      '/storeOps/accountaddresses.png',
      '/storeOps/privacyPolicy.png',
      '/storeOps/address.png',
      '/storeOps/ordersuccess.png',
      '/storeOps/activity.png',
      '/storeOps/adminproducts.png',
      '/storeOps/editproduct.png',
      '/storeOps/mobileadmin.png',
      '/storeOps/adminusers.png',
      '/storeOps/adminuserdetails.png',
      '/storeOps/adminmakedeal.png',
      '/storeOps/newsletter.png',
      '/storeOps/admincategories.png',
      '/storeOps/editcategory.png',
      '/storeOps/adminorders.png'
    ],
    description: `StoreOpertions is a robust E-Commerce platform designed to enhance the online shopping experience for users and businesses. Built using the latest frontend techonologies such as React and Next, payment processing with Stripe and real time email notifications using nodemailer and webhooks, as well as image stroage solution with Amazon S3. Explore the README for comprehensive setup instructions and additional details.`,
    features: [
      'Product and category management (CRUD operations)',
      'Cart functionality and payment processing with Stripe',
      'User authentication and order management',
      'Admin panel for comprehensive business operations',
      'Responsive design for desktop and mobile, with pagination , filtering and search functionality',
      'Detailed analytics and reporting'
    ],
    livelink: 'https://palettehub.vercel.app/',
    githubrepo: 'https://github.com/tomyRomero/storeOps',
    year: '2024',
    isLive: true,
  },
  {
    title: 'iMovies',
    type: 'Full Stack CRUD Content Management System',
    tools: [
      '/assets/reactjs.png',
      '/assets/sql.png',
      '/assets/dotnet.png',
      '/assets/azure.png'
    ],
    images: [
      '/iMovies/login.png',
      '/iMovies/imovieshome.png',
      '/iMovies/usermovielist.png',
      '/iMovies/addmovie.png',
      '/iMovies/moviemodal.png',
      '/iMovies/signup.png',
      '/iMovies/profile.png'
    ],
    description: `For the iMovies project, I contributed to both the frontend and backend development, creating a comprehensive content management system for movie enthusiasts. My responsibilities included helping with the backend using ASP.NET Core, integrating Entity Framework Core and SQL Server for data management, and implementing API endpoints. On the frontend, I developed dynamic React components for managing movie collections.`,
    features: [
      'Content management for movie collections',
      'User authentication with JWT',
      'Reponisve UI/UX',
      'Integration with OMDb API for movie data',
      'CRUD operations for managing user movie lists',
      'Social features including movie sharing, liking, and community interactions, such as displaying top-rated movies.',
      'Secure data management with Azure SQL Server',
      'Unit testing with xUnit and front-end testing with Jest'
    ],
    livelink: '', 
    githubrepo: 'https://github.com/240708-NET-FS/Project2_OMDb_API_Movies_CMS_Group1',
    year: '2024',
    isLive: false,
  }
];

//Techs
export const technologies = [
  {
    name: "HTML 5",
    icon: html.src,
  },
  {
    name: "CSS 3",
    icon: css.src,
  },
  {
    name: "JavaScript",
    icon: javascript.src,
  },
  {
    name: "TypeScript",
    icon: typescript.src,
  },
  {
    name: "React JS",
    icon: reactjs.src,
  },
  {
    name: ".net",
    icon: dotnet.src
  },
  {
    name: "azure",
    icon: azure.src
  },
  {
    name: "git",
    icon: git.src,
  },
  {
    name: "docker",
    icon: docker.src,
  },
  {
    name: "SQLServer",
    icon: sqlserver.src,
  },
  {
    name: "next.js",
    icon: next.src
  },
  {
    name: "Amazon Web Services",
    icon: aws.src
  }
];

export const experiences = [
  {
    title: "Software Developer Trainee",
    company: "Revature",
    date: "June - September 2024",
    description: [
      "Gained hands-on experience in an Agile environment, receiving training in C# .NET, React, MS SQL Server, and DevOps.",
      "Collaborated with teams, ensuring code quality through unit testing and version control.",
      "Gained proficiency in cloud services using pipeline, CI/CD, and containerization.",
    ]
  },
  {
    title: "Software Developer Intern",
    company: "LocalChef",
    date: "January 2025 - Present",
    description: [
      "Assist in developing and maintaining software using React, Java Spring Boot, AWS, and MySQL.",
      "Collaborate with a team to implement secure authentication, payment integration, and an intuitive user experience.",
      "Work in a fast-paced startup environment, delivering scalable and maintainable code.",
    ]
  }
];

export const contactDetails = [
  {
    type: "Email",
    value: "tomyfletcher99@hotmail.com",
    href: "mailto:tomyfletcher99@hotmail.com",
  },
  {
    type: "LinkedIn",
    value: "Tomy Romero",
    href: "https://www.linkedin.com/in/tomy-romero-902476145/",
  },
  {
    type: "Location",
    value: "U.S. Danielson, CT 06239",
    href: "",
  },
];

