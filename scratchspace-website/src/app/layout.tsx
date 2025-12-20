import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://scratchspace.dev';
const SITE_NAME = 'scratchspace.dev';
const SITE_TITLE = 'scratchspace.dev - Technical Development Studio';
const SITE_DESCRIPTION =
  'Technical development studio building custom web applications, AI-powered solutions, and scalable digital platforms for businesses. The development arm of RBK Strategies.';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  keywords: [
    'Rex Kirshner',
    'RBK Strategies',
    'technical development',
    'software development',
    'web applications',
    'custom software',
    'AI solutions',
    'digital platforms',
    'Next.js',
    'TypeScript',
    'React',
    'full-stack development',
    'business solutions',
  ],
  authors: [
    { name: 'Rex Kirshner', url: 'https://rexkirshner.com' },
    { name: 'RBK Strategies', url: 'https://rbkstrategies.com' },
  ],
  creator: 'Rex Kirshner',
  publisher: 'RBK Strategies',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'scratchspace.dev - Technical Development Studio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    // Add your verification codes when available
    // google: 'your-google-site-verification',
    // yandex: 'your-yandex-verification',
    // bing: 'your-bing-verification',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        {children}
      </body>
    </html>
  );
}
