import styled from 'styled-components'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Providers } from '../providers'
import { StyledComponentsRegistry } from '@/lib/styled-components-registry'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geist_mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

// Styled Components
const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f0f4f8 100%);
  color: #111827;
  font-smoothing: antialiased;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  z-index: 50;

  &:focus {
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(90deg, #2563eb 0%, #9333ea 100%);
    color: white;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    border-radius: 0 0 0.5rem 0;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 300ms ease-in-out;
`

const Main = styled.main`
  flex: 1;
  width: 100%;
`

export const metadata: Metadata = {
  metadataBase: new URL('https://www.honestneed.com'),
  title: {
    default: 'Honest Need — Help a Neighbor. Change a Life.',
    template: '%s | Honest Need',
  },
  description:
    'Honest Need is a community crowdfunding and peer-support platform. Help a neighbor, change a life. Create needs, share them, and let people help — directly.',
  keywords: [
    'fundraising',
    'crowdfunding',
    'community',
    'campaigns',
    'donation',
    'sharing',
    'sweepstakes',
  ],
  authors: [{ name: 'Honest Need Team' }],
  creator: 'Honest Need',
  applicationName: 'Honest Need',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.honestneed.com',
    siteName: 'Honest Need',
    title: 'Honest Need — Help a Neighbor. Change a Life.',
    description:
      'Community crowdfunding and peer-support platform. Create a need, share it, and let people help — directly.',
    images: [
      {
        url: 'https://www.honestneed.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Honest Need Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Honest Need — Help a Neighbor. Change a Life.',
    description:
      'Community crowdfunding and peer-support platform. Create a need, share it, and let people help — directly.',
    images: ['https://www.honestneed.com/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#10B981',
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <StyledComponentsRegistry>
        <Providers>
          {/* Skip to main content link for accessibility */}
          <SkipLink href="#main-content">
            Skip to main content
          </SkipLink>

          {/* Header with enhanced styling */}
          <Header>
            <Navbar />
          </Header>

          {/* Main content with flex-1 to push footer down */}
          <Main id="main-content">
            {children}
          </Main>

          {/* Footer */}
          <Footer />

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </StyledComponentsRegistry>
    </>
  )
}
