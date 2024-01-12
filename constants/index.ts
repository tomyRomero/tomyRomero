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
  { img: tomy, title: 'tomyRomero', alt: 'picture of Tomy Romero smiling' },
  { img: uvi, title: 'University of the Virgin Islands', alt: 'University of the Virgin Islands' },
  { img: scholarship, title: 'Scholarship Award winner', alt: 'Picture of ScholarShip Reception' },
  { img: stt, title: 'St.Thomas', alt: 'St.Thomas USVI' },
  { img: deanslist, title: 'Deans List Reception', alt: 'Deans List Reception' },
  { img: art, title: 'My Painting', alt: 'Picture of a Painting by Tomy Romero' },
  { img: president, title: 'Picture with President of University of the Virgin Islands', alt: 'Picture with President of University of the Virgin Islands' },
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
  description: 'AI powered full stack social media platform and messaging app with user authentication, using AWS, RDS, S3, mySQL, Web Sockets, Clerk auth, Zod forms, ShadCN & headless UI, openAI, tailwind and Next.js',
  link: "https://github.com/tomyRomero/sparks"
},
{
  title: "Class Organizer",
  techStack: 'Java EE, Servlet, mySQL, Glassfish, JavaServerPages (JSP)',
  projectIcon: '/assets/github.svg',
  image: '/class/Landing.png',
  description: 'A starter full-stack Java Web App with built in user auth that allows users to add and remove classes to create class schedules.',
  link: "https://github.com/tomyRomero/classOrganizer"
},
{
  title: "Electric GUI",
  techStack: 'Java, Javax Swing, Java Awt',
  projectIcon: '/assets/github.svg',
  image: '/javaGui/CustomerHome.png',
  description: 'A starter GUI Front End Application using Java framework spring to provide a Graphical User Interface experience, with a built in database that creates binary files and reads from them, also updates them. This was the first app I ever created during college and was used for a project.',
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
    description: `Threads like Social media platform with AI-powered post generation with various categories. Dynamic home page with filtering, image storage powered by the cloud.
    User profile management and user-to-user messaging system using web sockets.
    Like comment and share functionality. As well as notification system. Personal profile pages.
    Fully Responsive for all screens, phones, tablets and desktops.
    Liverages the latest of Next.js by using server actions and API routes, API routes include, openAIChat, openAIImage, and S3 for more details check out the readMe in the github repo!`,
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
    description: `For my first full stack project I wanted to fix a common issue amongst my classmates in college.
    Everytime we signed up for classes we would receive a class schedule. However, this schedule just had numbers and letters of the day, and it was not in order or visualized in a matter where you are organized and have a clear understanding of how your days would look like.
    I wrote out to write a simple program that lets Users create an account (self build auth) and proceed to record their class data like how it is in the default schedule and then my program would visualize a schedule that is clearer to understand. This was my first web app and it allowed me to learn the basics of frontend and backend design for frontend I used JavaServerPages and for Backend I used Java Servlets. I hosted it on an EC2 in AWS for some time before I decided to take it down to save resources, for more details on how I hosted it, check out the ReadME in my github Repo!`,
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
    description: `The application uses Java framework spring to provide a Graphical User Interface experience for an Electric Company, this was the first app I ever created during college and was used for a project. The app mostly serves as boiler plate for future interactivity functionality, but features such as creating accounts, logging in and changing passwords, as well as changing the balance of users and logging in as Admin, works flawlessly. I had limited knowledge back in the day and no access to database technologies, so I created my own database without knowing by writing to binary files and reading to them as well as reading from text files, this was my first time creating a user auth experience. The ReadME in my github Repo talks more about it!`,
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

