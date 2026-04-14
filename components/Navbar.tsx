'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-slate-900 bg-black flex items-center justify-between px-8 sticky top-0 z-50">
      {/* Brand Section - Stacked Layout */}
      <Link href="/" className="flex flex-col group">
        
        <span className="font-black italic text-xl tracking-tighter leading-none mt-0.5">
          <span className="text-blue-600">KSL</span>
          <span className="text-orange-600 ml-1">S3</span>
        </span>
        <span className="font-black italic text-sm tracking-[0.3em] text-white/90 leading-none uppercase">
          KUTWAD SUPER LEAGUE
        </span>
      </Link>
      
      {/* Navigation Links */}
      <div className="flex gap-8 items-center">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-500 transition-colors">
          Auction Live
        </Link>
        <Link href="/all-players" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-500 transition-colors">
          All Players
        </Link>
        <Link href="/sold-players" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 hover:text-emerald-400 transition-colors">
          Sold
        </Link>
        <Link href="/unsold-players" className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-400 transition-colors">
          Unsold
        </Link>
      </div>
      
      {/* Live Status Indicator for Projector */}
      <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Live</span>
      </div>
    </nav>
  );
}