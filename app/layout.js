import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import ScrollAnimator from '@/components/ScrollAnimator';
import PageTransition from '@/components/PageTransition';
import BackToTop from '@/components/BackToTop';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0C0A07',
};

export const metadata = {
  metadataBase: new URL('https://portfolio-studio-207.preview.emergentagent.com'),
  title: {
    default: 'FORMA/ROAST — Specialty Coffee Roastery',
    template: '%s · FORMA/ROAST',
  },
  description:
    'Small-batch specialty coffee roasted in Brooklyn. Single origins, considered blends, and brew gear, all crafted with slow attention.',
  keywords: [
    'specialty coffee',
    'coffee roaster',
    'single origin',
    'small batch',
    'Brooklyn coffee',
    'subscription coffee',
  ],
  openGraph: {
    type: 'website',
    title: 'FORMA/ROAST — Specialty Coffee Roastery',
    description: 'Small-batch specialty coffee, roasted with slow attention.',
    siteName: 'FORMA/ROAST',
    images: [
      { url: '/og-image.png', width: 1200, height: 630, alt: 'FORMA/ROAST' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FORMA/ROAST — Specialty Coffee Roastery',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-bg text-text antialiased grain-overlay min-h-screen flex flex-col">
        <CustomCursor />
        <Navigation />
        <main className="relative flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <BackToTop />
        <ScrollAnimator />
      </body>
    </html>
  );
}
