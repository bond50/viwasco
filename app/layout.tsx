import { ReactNode } from 'react';
import { Inter, Raleway, Roboto } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';

import { ToastContainer } from 'react-toastify';
import { Metadata } from 'next';
import { defaultMetadata } from '@/lib/seo/metadata';

const defaultFont = Roboto({
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--default-font',
  display: 'swap',
  subsets: ['latin'],
});

const headingFont = Raleway({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--heading-font',
  display: 'swap',
  subsets: ['latin'],
});

const navFont = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--nav-font',
  display: 'swap',
  subsets: ['latin'],
});

export const metadata: Metadata = defaultMetadata();

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${defaultFont.variable} ${headingFont.variable} ${navFont.variable}`}
    >
      <body id="top">
        {children}
        <ToastContainer position="top-right" />
      </body>
    </html>
  );
}
