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

//Links for Nav Menu
export const navLinks = [
  {
    title: 'Home',
    path: '/',
    image: '/assets/homenav.jpg',
  },
  {
    title: 'Contact',
    path: './contact',
    image: '/assets/contactnav.jpg',
  },
  {
    title: 'Projects',
    path: '#projects',
    image: '/assets/projectsnav.jpg',
  },
  {
    title: 'About',
    path: '#about',
    image: '/assets/about.jpg',
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
  title: "Sparks",
  techStack: 'React, AWS, Next.js, Node.js, mySQL',
  projectIcon: '/assets/github.svg',
  image: '/sparks/sparks-chats.png',
  description: 'AI powered full stack social media platform and messaging app with user authentication, using RDS, S3, mySQL, Web Sockets, Next.js and much more.',
  link: "https://github.com/tomyRomero/sparks"
},
{
  title: "Class Organizer",
  techStack: 'Java EE, Servlet, mySQL, Glassfish, JavaServerPages (JSP)',
  projectIcon: '/assets/github.svg',
  image: '/class/Landing.png',
  description: 'A starter Java EE Web App that allows users to visualize class schedules.',
  link: "https://github.com/tomyRomero/classOrganizer"
},
{
  title: "Electric GUI",
  techStack: 'Java, Javax Swing, Java Awt',
  projectIcon: '/assets/github.svg',
  image: '/javaGui/CustomerHome.png',
  description: 'A starter GUI Front End Application using Java framework spring to provide a Graphical User Interface experience, with a unique approach to data storage by creating a database using binary and text files.',
  link: "https://github.com/tomyRomero/electricCompanyGUIApp"
},
]

//Projects in Detail
export const projectDetails = [
  {
    title: 'Sparks',
    type: 'Full Stack CRUD',
    tools: ['/assets/sql.png', '/assets/next.webp', '/assets/reactjs.png', '/assets/tailwind.png', '/assets/typescript.png', '/assets/s3.svg', '/assets/rds.webp', '/assets/pusher.png'],
    images: ['/sparks/sparks-login.png','/sparks/sparks-home.png','/assets/sparks-home-moblie.png','/sparks/sparks-studio.png', '/sparks/sparks-chats.png', '/sparks/sparks-noti.png', '/sparks/sparks-profile.png', '/sparks/sparks-message.png', '/sparks/sparks-post.png', '/sparks/sparks-share.png','/sparks/sparks-search.png', '/sparks/movieSpark.png', '/sparks/novelSpark.png' ],
    description: `This full-stack web application empowers users to discover and create new ideas in various categories, ranging from movies and novels to artworks, fashion, and more. Leveraging the latest technologies, Sparks offers a dynamic home page with real-time filtering, a user-to-user messaging system powered by web sockets, and AI-driven post generation with customizable categories. Key features include an innovative AI-powered post generation system, cloud-based image storage with S3, user profile management, real-time messaging using web sockets, and a robust like-comment-share functionality and pagination. The platform is further enriched with a notification system, personalized profile pages, and a thoughtful database schema that supports relationships between users and posts.`,
    livelink: 'https://sparkify.vercel.app/',
    githubrepo: 'https://github.com/tomyRomero/sparks',
    year: '2023',
    isLive: true,
  },
  {
    title: 'Class Organizer',
    type: 'Full Stack CRUD',
    tools: ['/assets/sql.png', '/assets/java.png', '/assets/jsp.webp', '/assets/html.png', '/assets/css.png'],
    images: ['/class/Home.png', '/class/CreateAccount.png', '/class/Login.png', '/class/Landing.png', '/class/Schedule.png','/class/AddClass.png', '/class/RemoveClass.png', '/class/AccountInfo.png'],
    description: `My initial web application, a program that allows users to create accounts and visualize class schedules in a clear format. Using JavaServer Pages (JSP), CSS, and HTML for the frontend, and Java Servlets for the backend, the app simplifies the scheduling process. Initially hosted on AWS EC2, the project showcases my early exploration into web development. For more details, refer to the README in my GitHub repository`,
    livelink: '',
    githubrepo: 'https://github.com/tomyRomero/classOrganizer',
    year: '2022',
    isLive: false,
  }, 
  {
    title: 'Electric GUI',
    type: 'Java Graphical User Interface App',
    tools: ['/assets/java.png', '/assets/spring.png' ],
    images: ['/javaGui/Login.png', '/javaGui/CreateAccount.png' , '/javaGui/CustomerHome.png', '/javaGui/AdminHome.png', '/javaGui/ChangePassword.png', '/javaGui/CustomerAccountInfo.png', '/javaGui/CustomerAccountPayment.png' , '/javaGui/CustomerConsumption.png'],
    description: `GUI Java app that encompasses essential features like creating accounts, logging in, changing passwords, modifying user balances, and administrator login capabilities (mostly boilerplate for future functionality). With limited knowledge and absence of database technologies at the time, I devised a unique approach by creating my database using binary and text files.`,
    livelink: '',
    githubrepo: 'https://github.com/tomyRomero/electricCompanyGUIApp',
    year: '2021',
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
    name: "Tailwind CSS",
    icon: tailwind.src,
  },
  {
    name: "Node JS",
    icon: nodejs.src,
  },
  {
    name: "MongoDB",
    icon: mongodb.src,
  },
  {
    name: "Three JS",
    icon: threejs.src,
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
  },
];

