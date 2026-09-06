import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Globe, Lock, Satellite } from 'lucide-react'
import Link from 'next/link'
import GeoChatNavBtn from '@/components/layout/GeoChatNavBtn' // <-- Import the new button

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'National Earth Observation Portal',
  description: 'Centralized Remote Sensing & Spatial Data Infrastructure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-slate-300 text-slate-800 antialiased`}>
        
        {/* Top Ribbon */}
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-1 flex justify-between items-center text-[11px] text-slate-600">
          <div className="flex gap-4">
            <span className="font-semibold">GOVERNMENT OF INDIA</span>
            <span>MINISTRY OF EARTH SCIENCES</span>
          </div>
          <div className="flex gap-2 cursor-pointer font-bold">
            <span className="hover:bg-slate-200 px-2">-A</span>
            <span className="hover:bg-slate-200 px-2">A</span>
            <span className="hover:bg-slate-200 px-2">+A</span>
          </div>
        </div>
        
        {/* Main Header Container */}
        <div className="flex flex-col shrink-0 z-50 shadow-md">
          <header className="bg-gov-header text-white flex justify-between items-center px-4 py-2">
            
            <div className="flex items-center space-x-6">
              <Link href="/" className="font-bold text-lg flex items-center tracking-wide hover:text-blue-200 transition">
                <Globe className="mr-3 text-blue-400 w-5 h-5" />
                EARTH OBSERVATION PORTAL
              </Link>
              
              <nav className="hidden md:flex space-x-2 text-xs font-medium items-center">
                <Link href="/" className="hover:bg-slate-700 px-3 py-1.5 transition">Home</Link>
                <Link href="/dashboard" className="bg-slate-700 px-3 py-1.5 transition border border-slate-600 shadow-inner">Visual Tools</Link>
                <Link 
                  href="/satquery" 
                  className="hover:bg-slate-700 px-3 py-1.5 transition text-blue-400 font-bold border border-blue-600/30 bg-blue-900/20 ml-2 flex items-center cursor-pointer"
                >
                  <Satellite className="w-3 h-3 mr-1.5" /> SatQuery Workspace
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4 text-xs font-semibold">
              <span className="text-slate-300 border-r border-slate-600 pr-4 font-mono text-xxs tracking-widest">[UNCLASSIFIED // FOUO]</span>
              <span className="text-slate-300 border-r border-slate-600 pr-4">Guest Access</span>
              <button className="hover:text-blue-300 transition flex items-center bg-transparent border border-slate-500 px-3 py-1 hover:bg-slate-700">
                <Lock className="w-3 h-3 mr-2" /> Sign In
              </button>
            </div>
          </header>

          {/* Color Ribbons (Now in standard document flow) */}
          <div className="w-full h-1 bg-gov-saffron"></div>
          <div className="w-full h-[2px] bg-gov-green"></div>
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>

      </body>
    </html>
  )
}