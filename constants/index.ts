
//Home Page Pictures
import proTomy from '../public/assets/tomyRomero.jpg'
import tomy from '../public/assets/tomyRomero.jpeg'
import uvi from '../public/assets/uvi.jpeg'
import president from '../public/assets/presidentUvi.jpeg'
import stt from '../public/assets/St.Thomas.webp'
import deanslist from '../public/assets/deanslist.jpeg'
import art from '../public/assets/macmiller.jpeg'
import scholarship from '../public/assets/scholarship.jpeg'
import uvilogo from '../public/assets/uvi_icon.webp'
import sga from '../public/assets/sga.jpeg'

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


export const resumeLink = `https://docs.google.com/document/d/1NgKOp9uVqTW2ntBhMemJ5E-mporMj0cH9h6Cnki2nWA/edit?usp=sharing`;

export const intro = `I’m passionate about delivering software solutions that meets the needs of users. I value effective communication and thrive in collaborative environments where I can exchange ideas, give and receive constructive feedback, and work towards common goals. I enjoy engaging with my colleagues and solving problems together.`

export const about =`I am a Computer Science graduate with a strong foundation in full stack development, specializing in React, C#, ASP.NET, .NET, REST APIs, and SQL Server, along with knowledge of DevOps practices in Git, Amazon Web Services and Azure.`

//Links for Nav Menu
export const navLinks = [
  { title: 'About', path: 'about' },
  { title: 'Experience', path: 'experience' },
  { title: 'Projects', path: 'projects' },
  { title: 'Contact', path: 'contact' },
];

//Images for home page Photos.tsx
export const images = [
  { img: president, title: 'Picture with President of University of the Virgin Islands', alt: 'Picture with President of University of the Virgin Islands' },
  { img: uvi, title: 'University of the Virgin Islands', alt: 'University of the Virgin Islands' },
  { img: scholarship, title: 'Scholarship Award winner', alt: 'Picture of ScholarShip Reception' },
  { img: proTomy, title: 'Tomy Romero at Revature', alt: 'Picture of Tomy Romero' },
  { img: deanslist, title: 'Deans List Reception', alt: 'Deans List Reception' },
  { img: art, title: 'My Painting', alt: 'Picture of a Painting by Tomy Romero' },
  { img: tomy, title: 'tomyRomero', alt: 'picture of Tomy Romero smiling' },
  { img: uvilogo, title: 'University Logo', alt: 'Picture of UVI logo' },
  { img: sga, title: 'Student Government Association Junior Senator', alt: 'Picture of Tomy Romero as Student Government Association Junior Senator' },
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
    title: "iMovies",
    techStack: 'React, ASP.NET Core, SQL Server, Azure, OMDb API',
    projectIcon: '/assets/github.svg',
    image: '/iMovies/imovieshome.png',
    description: 'Contributed to a content management system as part of a collaborative team, that allows users to manage a list of movies with social media features.',
    link: "https://github.com/240708-NET-FS/Project2_OMDb_API_Movies_CMS_Group1",
  },
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
      '/iMovies/imovieshome.png',
      '/iMovies/usermovielist.png',
      '/iMovies/addmovie.png',
      '/iMovies/moviemodal.png',
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
    name: "dotnet",
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
    name: "SQL server",
    icon: sqlserver.src,
  },
  {
    name: "next.js",
    icon: next.src
  }
];

export const experiences = [
  {
    title: "Software Developer Trainee",
    company: "Revature",
    date: "June - September 2024",
    description: [
      "Trained in full-stack development with .NET, React, MS SQL Server, and DevOps methodologies, alongside unit testing for code quality.",
      "Developed proficiency in building and maintaining dynamic front-end interfaces with React and REST APIs with ASP.NET.",
      "Gained hands-on experience with CI/CD pipelines and Azure cloud-based solutions.",
      "Collaborated in an agile environment on end-to-end development projects."
    ]
  }
];

