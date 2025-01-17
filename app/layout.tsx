import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Flashcard Movie Game',
  description: 'A game to guess which movie has a higher budget',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head><meta name="google-adsense-account" content="ca-pub-3940998307424240"></head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
