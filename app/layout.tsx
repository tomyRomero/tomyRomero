import type { Metadata, Viewport } from 'next';
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { NavEvents } from '@/components/nav';

const BASE = 'https://tomyromero.vercel.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f5f7' },
    { media: '(prefers-color-scheme: dark)',  color: '#0a0c11' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE),

  title: {
    default:  'Tomy F. Romero · Software Engineer',
    template: '%s · Tomy F. Romero',
  },

  description:
    'Full-stack software engineer working in ASP.NET Core, React, and SQL Server. Based in Ocala, Florida.',

  keywords: [
    'Tomy F. Romero',
    'software engineer',
    'full-stack developer',
    'ASP.NET Core developer',
    'React developer',
    'C# developer',
    'SQL Server',
    'TypeScript',
    'Next.js',
    '.NET developer',
    'Azure',
    'Ocala software engineer',
    'Florida software engineer',
    'portfolio',
    'web developer',
    'UVI graduate',
  ],

  authors:   [{ name: 'Tomy F. Romero', url: BASE }],
  creator:   'Tomy F. Romero',
  publisher: 'Tomy F. Romero',

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  alternates: { canonical: BASE },

  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         BASE,
    siteName:    'Tomy F. Romero · Portfolio',
    title:       'Tomy F. Romero · Software Engineer',
    description:
      'Full-stack software engineer working in ASP.NET Core, React, and SQL Server. Based in Ocala, Florida.',
    images: [{
      url:    '/opengraph-image',
      width:  1200,
      height: 630,
      alt:    'Tomy F. Romero · Software Engineer Portfolio',
    }],
  },

  twitter: {
    card:        'summary_large_image',
    title:       'Tomy F. Romero · Software Engineer',
    description: 'Full-stack software engineer working in ASP.NET Core, React, and SQL Server. Based in Ocala, Florida.',
    images:      ['/opengraph-image'],
  },

  category: 'technology',
};

// JSON-LD
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':    'Person',
      '@id':      `${BASE}/#person`,
      name:       'Tomy F. Romero',
      url:        BASE,
      image:      `${BASE}/assets/headshot.jpg`,
      jobTitle:   'Full-Stack Software Engineer',
      description:
        'Full-stack software engineer working in ASP.NET Core, React, and SQL Server.',
      knowsLanguage: ['English', 'Spanish'],
      alumniOf: {
        '@type':  'CollegeOrUniversity',
        name:     'University of the Virgin Islands',
        sameAs:   'https://www.uvi.edu',
      },
      address: {
        '@type':         'PostalAddress',
        addressLocality: 'Ocala',
        addressRegion:   'FL',
        addressCountry:  'US',
      },
      email:   'tomyfletcher99@hotmail.com',
      sameAs:  [
        'https://github.com/tomyRomero',
        'https://www.linkedin.com/in/tomyromero/',
      ],
      knowsAbout: [
        'ASP.NET Core', 'C#', 'React', 'Next.js', 'TypeScript',
        'SQL Server', 'Azure', 'Docker',
      ],
    },
    {
      '@type':     'WebSite',
      '@id':       `${BASE}/#website`,
      url:         BASE,
      name:        'Tomy F. Romero · Portfolio',
      description: 'Full-stack software engineer portfolio',
      publisher:   { '@id': `${BASE}/#person` },
    },
  ],
};

// Variable font, so no weight list
const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-sans',
  display:  'swap',
});

// Only used for small labels, so not preloaded
const ibmPlexMono = IBM_Plex_Mono({
  subsets:  ['latin'],
  weight:   ['400', '500'],
  variable: '--font-mono',
  display:  'swap',
  preload:  false,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set by an inline script before hydration
    <html
      lang="en"
      className={`${dmSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main id="main-content">
          {children}
        </main>
        <NavEvents />
        <Analytics />
      </body>
    </html>
  );
}
