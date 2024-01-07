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

//Links for Nav Menu
export const navLinks = [
  {
    title: 'Home',
    path: '',
    image: '/assets/sun.svg',
  },
  {
    title: 'Contact',
    path: 'contact',
    image: '/assets/sun.svg',
  },
  {
    title: 'Projects',
    path: 'works',
    image: '/assets/sun.svg',
  },
  {
    title: 'About',
    path: '#about',
    image: '/assets/sun.svg',
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
  techStack: 'React (Next.js), Node.js, mySQL',
  projectIcon: '/assets/github.svg',
  image: '/assets/sparks-home-moblie.png',
  description: 'AI powered full stack social media platform and messaging app with user authentication, using AWS, RDS, S3, mySQL, Web Sockets, Clerk auth, Zod forms, ShadCN & headless UI, openAI, tailwind and Next.js',
  link: "https://github.com/tomyRomero/sparks"
},
{
  title: "Class Organizer",
  techStack: 'Java EE, Servlet, mySQL, Glassfish',
  projectIcon: '/assets/github.svg',
  image: '/assets/class.png',
  description: 'A starter full-stack Java Web App with built in user auth that allows users to add and remove classes to create class schedules.',
  link: "https://github.com/tomyRomero/classOrganizer"
},
{
  title: "ElectricCompanyGUIApp",
  techStack: 'Java, Javax Swing, Java Awt',
  projectIcon: '/assets/github.svg',
  image: '/assets/CustomerHome.png',
  description: 'A starter GUI Front End Application using Java framework spring to provide a Graphical User Interface experience, with a built in database that creates binary files and reads from them, also updates them. This was the first app I ever created during college and was used for a project.',
  link: "https://github.com/tomyRomero/electricCompanyGUIApp"
},
]

//Projects in Detail
export const projectDetails = [
  {
    title: '',
    tools: [''],
    images: ['/assets/CustomerHome.png','/assets/class.png', '/assets/sparks-home-moblie.png']

      // title: string;
      // isFeatured: boolean;
      // tools: string[];
      // color: string;
      // images: Image[];
      // prefix: string;
      // slug: string;
      // year: string;
      // liveurl: string;
      // giturl: string;
      // description: Description;
      // type: ProjectType;
      // catagory: Catagory;
      // arrowcolor: Arrowcolor;
      // ischallenge: boolean;
      // createdat: string;
      // challengeurl?: string;
    
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
  }
];

