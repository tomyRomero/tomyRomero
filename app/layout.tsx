import type { Metadata } from 'next';
import { Instrument_Serif, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';

const BASE = 'https://tomyromero.vercel.app';

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(BASE),

  title: {
    default:  'Tomy Romero Seas — Software Engineer',
    template: '%s — Tomy Romero Seas',
  },

  description:
    'Full-stack software engineer specializing in ASP.NET Core, React, and SQL Server. ' +
    'Currently building healthcare systems at MEDsys Software Solutions in Connecticut. ' +
    'Open to new opportunities.',

  keywords: [
    'Tomy Romero Seas',
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
    'Connecticut software engineer',
    'portfolio',
    'web developer',
    'healthcare software',
    'UVI graduate',
  ],

  authors:   [{ name: 'Tomy Romero Seas', url: BASE }],
  creator:   'Tomy Romero Seas',
  publisher: 'Tomy Romero Seas',

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
    siteName:    'Tomy Romero Seas — Portfolio',
    title:       'Tomy Romero Seas — Software Engineer',
    description:
      'Full-stack software engineer specializing in ASP.NET Core, React, and SQL Server. ' +
      'Open to new opportunities.',
    images: [{
      url:    '/opengraph-image',
      width:  1200,
      height: 630,
      alt:    'Tomy Romero Seas — Software Engineer Portfolio',
    }],
  },

  twitter: {
    card:        'summary_large_image',
    title:       'Tomy Romero Seas — Software Engineer',
    description: 'Full-stack software engineer · ASP.NET Core · React · SQL Server · Open to work.',
    images:      ['/opengraph-image'],
  },

  category: 'technology',
};

// ── JSON-LD structured data ───────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':    'Person',
      '@id':      `${BASE}/#person`,
      name:       'Tomy Romero Seas',
      url:        BASE,
      image:      `${BASE}/assets/tomyRomero.jpeg`,
      jobTitle:   'Software Engineer 1',
      worksFor: {
        '@type': 'Organization',
        name:    'MEDsys Software Solutions',
      },
      alumniOf: {
        '@type':  'CollegeOrUniversity',
        name:     'University of the Virgin Islands',
        sameAs:   'https://www.uvi.edu',
      },
      address: {
        '@type':         'PostalAddress',
        addressLocality: 'Connecticut',
        addressRegion:   'CT',
        addressCountry:  'US',
      },
      email:   'tomyfletcher99@hotmail.com',
      sameAs:  [
        'https://github.com/tomyRomero',
        'https://www.linkedin.com/in/tomyromero/',
      ],
      knowsAbout: [
        'ASP.NET Core', 'C#', 'React', 'Next.js', 'TypeScript',
        'SQL Server', 'Azure', 'Docker', 'Node.js', 'Spring Boot',
      ],
    },
    {
      '@type':     'WebSite',
      '@id':       `${BASE}/#website`,
      url:         BASE,
      name:        'Tomy Romero Seas — Portfolio',
      description: 'Full-stack software engineer portfolio',
      publisher:   { '@id': `${BASE}/#person` },
    },
  ],
};

// ── Fonts ─────────────────────────────────────────────────────────────────────
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight:  ['400'],
  style:   ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600'],
  variable: '--font-sans',
  display:  'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets:  ['latin'],
  weight:   ['400', '500'],
  variable: '--font-mono',
  display:  'swap',
});

// ── Layout ────────────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
