
//Home Page Pictures
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
import sqlServer from '../public/assets/sqlserver.jpeg'
import next from '../public/assets/next-js.svg'
import azure from '../public/assets/azure.png'
import dotnet from '../public/assets/dotnet.png'


export const intro = `I’m passionate about delivering software solutions that meets the needs of users. I value effective communication and thrive in collaborative environments where I can exchange ideas, give and receive constructive feedback, and work towards common goals. I enjoy engaging with my colleagues and solving problems together.`

export const about =`I am a Computer Science graduate with a strong foundation in full stack development, specializing in React, C#, ASP.NET, .NET, REST APIs, and SQL Server, along with knowledge of DevOps practices in Git, Amazon Web Services and Azure.`

//Links for Nav Menu
export const navLinks = [
  {
    title: 'HOME',
    path: '/#home',
    image: '/assets/homenav.jpg',
  },
  {
    title: 'ABOUT',
    path: '/#about',
    image: '/assets/about.jpg',
  },
  {
    title: 'PROJECTS',
    path: '/#projects',
    image: '/assets/projectsnav.jpg',
  },
  {
    title: 'CONTACT',
    path: '/#contact',
    image: '/assets/contactnav.jpg',
  },
];

//Images for home page Photos.tsx
export const images = [
  { img: president, title: 'Picture with President of University of the Virgin Islands', alt: 'Picture with President of University of the Virgin Islands' },
  { img: uvi, title: 'University of the Virgin Islands', alt: 'University of the Virgin Islands' },
  { img: scholarship, title: 'Scholarship Award winner', alt: 'Picture of ScholarShip Reception' },
  { img: stt, title: 'St.Thomas', alt: 'St.Thomas USVI' },
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
    description: 'As part of a collaborative team, I contributed to a content management system that allows users to manage a list of movies with social media features. Responsibilities: Frontend and backend development',
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
    description: 'Full-stack CRUD E-Commerce Platform with features like product and category management, cart functionality, user authentication, payment processing, order management, responsive design, and more.',
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
    tools: ['/assets/sql.png', '/assets/next.webp', '/assets/reactjs.png', '/assets/tailwind.png', '/assets/typescript.png', '/assets/s3.svg', '/assets/rds.webp', '/assets/pusher.png'],
    images: ['/sparks/sparks-login.png','/sparks/sparks-home.png','/assets/sparks-home-moblie.png','/sparks/sparks-studio.png', '/sparks/sparks-chats.png','/sparks/editSpark.png' , '/sparks/sparks-noti.png', '/sparks/sparks-profile.png', '/sparks/sparks-message.png', '/sparks/sparks-post.png', '/sparks/sparks-share.png','/sparks/sparks-search.png','/sparks/sparks-search-post.png', '/sparks/movieSpark.png', '/sparks/novelSpark.png' ],
    description: `Sparks empowers users to explore and share innovative ideas. It offers full CRUD operations for all posts, a dynamic homepage with real-time filtering, a user-to-user messaging system powered by web sockets, and AI-driven post generation with customizable categories. The platform includes a notification system with real-time updates, dynamic user profiles with data on their comments, likes, and authored posts. Additionally, users can search for other users and posts, and pagination is implemented for optimal performance. These are just some of the many features, click on the code button to read the ReadMe for more details!`,
    livelink: 'https://sparkify.vercel.app/',
    githubrepo: 'https://github.com/tomyRomero/sparks',
    year: '2023',
    isLive: true,
  },
  {
    title: "ArtifyMe",
    type: "Full Stack CRUD Mobile App",
    tools: ['/assets/typescript.png','/assets/s3.svg', '/assets/dotnet.png', '/assets/reactjs.png', '/assets/fastapi.png', '/assets/expo.png',  '/assets/sql.png',
      ],
    images: ['/artifyme/details.png', '/artifyme/canvas.png', '/artifyme/colorpicker.png', '/artifyme/home.png', '/artifyme/homedark.png','/artifyme/login.png', '/artifyme/signup.png', '/artifyme/about.png', '/artifyme/profile.png', '/artifyme/profiledark.png', '/artifyme/create.png', '/artifyme/results.png' ],
    description: 'ArtifyMe is a mobile application that enables users to convert sketches into images using AI-powered image generation. The app features a React Native frontend for seamless mobile experience, backed by a ASP .NET backend with JWT authentication for secure user management. Sketch-to-image conversion is facilitated by a Python FastAPI integrated with Stable Diffusion AI model. ArtifyMe utilizes Amazon S3 for cloud storage and SQL Server with Entity Framework for efficient data management. Click on the code button to explore the README for more details and detailed setup instructions.',
    livelink: 'https://github.com/tomyRomero/artifyme',
    githubrepo: 'https://github.com/tomyRomero/artifyme',
    year: '2024',
    isLive: false
  },
  {
    title: 'StoreOps',
    type: 'Full Stack CRUD E-Commerce Platform',
    tools: ['/assets/reactjs.png','/assets/next.webp', '/assets/typescript.png', '/assets/mongodb.png', '/assets/s3.svg', '/assets/nextauth.png', '/assets/stripe.svg'],
    images: ['/storeOps/home.png', '/storeOps/mobliehome.png', '/storeOps/promotions.png','/storeOps/footer.png',
    '/storeOps/products.png', '/storeOps/productdetails.png', '/storeOps/cart.png', '/storeOps/checkout.png','/storeOps/search.png'
    , '/storeOps/login.png','/storeOps/accountorderdetails.png','/storeOps/accountorders.png','/storeOps/accountaddresses.png',  '/storeOps/privacyPolicy.png', '/storeOps/address.png',
    , '/storeOps/ordersuccess.png', '/storeOps/activity.png', 
    '/storeOps/adminproducts.png', '/storeOps/editproduct.png',
     , '/storeOps/mobileadmin.png', '/storeOps/adminusers.png','/storeOps/adminuserdetails.png', 
      '/storeOps/adminmakedeal.png',   '/storeOps/newsletter.png',
      '/storeOps/admincategories.png', '/storeOps/editcategory.png', '/storeOps/adminorders.png',
    ],
    description: `StoreOps is a full-stack E-Commerce Platform designed to provide a seamless online shopping experience for users and businesses with an admin panel. With features like product and category management(create,read, update, delete), cart functionality, user authentication, payment processing, order management, and more, StoreOps offers a comprehensive solution for businesses. Please click on the code button to checkout the readMe for more details!`,
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
    description: `As part of a collaborative team, I contributed to a comprehensive platform designed for movie enthusiasts to manage and share their favorite movies. 
    Responsibilities:
    Developed a Movies Content Management System using ASP.NET Core, integrating the OMDb API to manage and display movie information.
    Implemented a RESTful API backend with C#, utilizing Entity Framework Core for database management, SQL Server for data persistence.
    Designed and built the client-server architecture, creating a dynamic React frontend with authentication and CRUD functionality for managing user movie lists, including searching, adding, editing, and deleting movies using the OMDb API for metadata retrieval and user input customization.
    Implemented social media capabilities, allowing users to share movie lists with followers, like/dislike movies, and view the most popular movies within the community.
    Hosted the database on Azure SQL Server for secure and scalable data management.
    Developed and executed unit tests using xUnit for backend services.
    Managed front-end testing using Jest.
    `,
    livelink: '', 
    githubrepo: 'https://github.com/240708-NET-FS/Project2_OMDb_API_Movies_CMS_Group1',
    year: '2024',
    isLive: false,
  }
]

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
    icon: sqlServer.src,
  },
  {
    name: "next.js",
    icon: next.src
  }
];

