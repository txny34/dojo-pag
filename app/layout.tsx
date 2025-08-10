import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fighting Spirit Dojo - Artes Marciales en Montevideo',
  description: 'Dojo de artes marciales en Montevideo. Clases de Boxeo, Muay Thai, K-1, Jiu-Jitsu. Entrenamiento profesional con instructores certificados.',
  keywords: 'artes marciales, dojo, montevideo, boxeo, muay thai, jiu-jitsu, k-1, entrenamiento, defensa personal',
  authors: [{ name: 'Fighting Spirit Dojo' }],
  creator: 'Fighting Spirit Dojo',
  publisher: 'Fighting Spirit Dojo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fighting-spirit-dojo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Fighting Spirit Dojo - Artes Marciales en Montevideo',
    description: 'Dojo de artes marciales en Montevideo. Clases de Boxeo, Muay Thai, K-1, Jiu-Jitsu. Entrenamiento profesional con instructores certificados.',
    url: 'https://fighting-spirit-dojo.com',
    siteName: 'Fighting Spirit Dojo',
    locale: 'es_UY',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fighting Spirit Dojo - Artes Marciales en Montevideo',
    description: 'Dojo de artes marciales en Montevideo. Clases de Boxeo, Muay Thai, K-1, Jiu-Jitsu.',
  },
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1f2937" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}