import tomy from '../public/assets/tomyRomero.jpeg'
import uvi from '../public/assets/uvi.jpeg'
import president from '../public/assets/presidentUvi.jpeg'
import stt from '../public/assets/St.Thomas.webp'
import deanslist from '../public/assets/deanslist.jpeg'
import art from '../public/assets/macmiller.jpeg'
import scholarship from '../public/assets/scholarship.jpeg'
import uvilogo from '../public/assets/uvi_icon.webp'
import sga from '../public/assets/sga.jpeg'

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
