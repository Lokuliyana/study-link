import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study Link Counselor OS",
  description: "Rapid Triage & CRM for Educational Counselors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-[#FAFAF9]`}>
      <body className="min-h-full flex flex-col font-sans text-gray-800">
        <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-8">
                <div className="flex-shrink-0 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    S
                  </div>
                  <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600">
                    StudyLink
                  </span>
                </div>
                <div className="hidden sm:flex space-x-1 items-center bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
                  <Link href="/" className="px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-white hover:shadow-sm text-gray-700">
                    Dashboard
                  </Link>
                  <Link href="/countries" className="px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:bg-white hover:shadow-sm text-gray-600">
                    Matrix
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>
          </div>
        </nav>
        
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
