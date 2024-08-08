
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
import mongodb from '../public/assets/mongodb.png'
import tailwind from '../public/assets/tailwind.png'
import git from '../public/assets/git.png'
import nodejs from '../public/assets/nodejs.png'
import css from '../public/assets/css.png'
import reactjs from '../public/assets/reactjs.png'
import threejs from '../public/assets/threejs.svg'
import typescript from '../public/assets/typescript.png'
import java from '../public/assets/java.png'
import sql from '../public/assets/sql.png'
import next from '../public/assets/next-js.svg'
import python from '../public/assets/python.png'
import springboot from '../public/assets/springboot.png'
import azure from '../public/assets/azure.png'
import dotnet from '../public/assets/dotnet.png'


export const intro = `I am a results-driven Computer Science graduate, armed with a Bachelor's degree and a strong foundation in software development. Seeking a rewarding position as a Junior Developer to apply my technical skills and contribute innovative solutions to drive team success.`

export const about =`I am a versatile developer with a proficiency in building both backends and frontends, with extensive experience in taking projects from inception to deployment on cloud platforms like Amazon Web Services and Azure. My expertise includes working with relational databases such as MySQL, building RESTful APIs, and developing engaging, responsive user interfaces. I also have a solid background in unit testing and creating robust user authentication systems.

Driven by a passion for continuous learning, I am eager to collaborate closely with employers to contribute to the creation of efficient, scalable, and user-friendly solutions that address real-world challenges. Let’s build something great together!`

//Links for Nav Menu
export const navLinks = [
  {
    title: 'Home',
    path: '/#home',
    image: '/assets/homenav.jpg',
  },
  {
    title: 'About',
    path: '/#about',
    image: '/assets/about.jpg',
  },
  {
    title: 'Projects',
    path: '/#projects',
    image: '/assets/projectsnav.jpg',
  },
  {
    title: 'Contact',
    path: '/contact',
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
    title: `Cloud Developer`,
    icon: '/assets/aws.svg.png',
  }
];

//Projects for Home Page
export const projects = [
{
  title: "ArtifyMe",
  techStack: "React Native, JAVA Spring Boot, Fast API, MongoDB",
  projectIcon: '/assets/github.svg',
  image: "/artifyme/details.png",
  description: 'Full-stack CRUD mobile app, Transform imaginative sketches into AI-generated images. Secured with JAVA spring-boot security JWT authentication',
  link: "https://github.com/tomyRomero/artifyme"
},
  {
    title: "StoreOps",
    techStack: 'Next.js, MongoDB Atlas, AWS, Stripe',
    projectIcon: '/assets/storeOps-icon.svg',
    image: '/storeOps/cart.png',
    description: 'Full-stack CRUD E-Commerce Platform with features like product and category management, cart functionality, user authentication, payment processing, order management, responsive design, and more.',
    link: "https://github.com/tomyRomero/storeOps"
  },
{
  title: "Sparks",
  techStack: 'Next.js, Web Sockets, AWS, mySQL',
  projectIcon: '/assets/github.svg',
  image: '/sparks/sparks-chats.png',
  description: 'AI powered full stack CRUD social media platform and messaging app with user authentication, using RDS, S3, Web Sockets and much more.',
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
    tools: ['/assets/typescript.png','/assets/s3.svg', '/assets/reactjs.png', '/assets/springboot.png', '/assets/fastapi.png', '/assets/mongodb.png' , '/assets/expo.png'],
    images: ['/artifyme/details.png', '/artifyme/canvas.png', '/artifyme/colorpicker.png', '/artifyme/home.png', '/artifyme/homedark.png','/artifyme/login.png', '/artifyme/signup.png', '/artifyme/about.png', '/artifyme/profile.png', '/artifyme/profiledark.png', '/artifyme/create.png', '/artifyme/results.png','/artifyme/contact.png' ],
    description: 'ArtifyMe is a mobile application that enables users to convert sketches into images using AI-powered image generation. The app features a React Native frontend for seamless mobile experience, backed by a JAVA Spring Boot backend with JWT authentication for secure user management. Sketch-to-image conversion is facilitated by a Python FastAPI integrated with Stable Diffusion AI model. ArtifyMe utilizes Amazon S3 for cloud storage and MongoDB for efficient data management. Click on the code button to explore the README for more details and detailed setup instructions.',
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
    icom: azure.src
  },
  {
    name: "Node JS",
    icon: nodejs.src,
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
    name: "Java",
    icon: java.src,
  },
  {
    name: "mySQL",
    icon: sql.src,
  },
  {
    name: "next.js",
    icon: next.src
  }
];

