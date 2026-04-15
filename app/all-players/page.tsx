'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AllPlayers() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ksl_players');
    if (saved) setPlayers(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-[#0a0a0c] p-6 rounded-2xl border border-slate-900 shadow-2xl">
          <div className="flex items-center gap-6">
            <Link href="/">
              <button className="text-slate-500 hover:text-blue-400 font-bold uppercase text-[10px] tracking-widest border border-slate-800 px-3 py-1 rounded-md transition-all">
                ← Back
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Master Player Pool</h1>
              <p className="text-blue-500 font-bold tracking-[0.3em] text-[10px] mt-1 uppercase">KSL Season 3 Status Tracker</p>
            </div>
          </div>
          <div className="flex gap-4 items-center text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Sold</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Unsold</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-700"></span> Pending</div>
          </div>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.map((p: any) => (
            <div 
              key={p._id} 
              onClick={() => setSelectedPlayer(p)}
              className={`relative bg-[#0a0a0c] border p-4 rounded-2xl flex items-center gap-4 transition-all shadow-lg cursor-pointer hover:scale-[1.02] active:scale-95 ${
                p.status === 'sold' ? 'border-emerald-500/20' : 'border-slate-800'
              }`}
            >
              {p.isIcon && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black font-black text-[8px] px-2 py-0.5 rounded-full shadow-lg z-10 italic">
                  ICON
                </div>
              )}

              <div className="relative shrink-0">
                <img 
                  src={p.photo || '/placeholder.png'} 
                  className={`w-16 h-16 rounded-xl object-cover border-2 ${
                    p.isIcon ? 'border-yellow-500' : 'border-slate-800'
                  } ${p.status === 'unsold' ? 'grayscale opacity-50' : ''}`} 
                  alt={p.name} 
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0c] ${
                  p.status === 'sold' ? 'bg-emerald-500' : p.status === 'unsold' ? 'bg-red-500' : 'bg-slate-700'
                }`} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black uppercase italic truncate leading-none mb-1">{p.name}</h3>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2">{p.playerType}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- COMPACT PLAYER FOCUS MODAL (SIZE UPDATED) --- */}
      {selectedPlayer && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all"
          onClick={() => setSelectedPlayer(null)}
        >
          <div 
            className="relative bg-[#0a0a0c] border border-slate-800 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 z-10 text-slate-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Compact Photo Section (h-56) */}
            <div className="relative h-60 w-full bg-slate-900">
              <img 
                src={selectedPlayer.photo || '/placeholder.png'} 
                className={`w-full h-full object-cover ${selectedPlayer.status === 'unsold' ? 'grayscale opacity-50' : ''}`}
                alt={selectedPlayer.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent" />
              
              <div className="absolute top-6 left-6 flex gap-2">
                {selectedPlayer.isIcon && (
                  <div className="bg-yellow-500 text-black font-black px-3 py-0.5 rounded-full italic tracking-tighter text-[10px]">
                    ICON
                  </div>
                )}
                <div className={`font-black px-3 py-0.5 rounded-full italic tracking-tighter text-[10px] uppercase ${
                    selectedPlayer.status === 'sold' ? 'bg-emerald-500 text-white' : 
                    selectedPlayer.status === 'unsold' ? 'bg-red-600 text-white' : 'bg-slate-700 text-white'
                }`}>
                  {selectedPlayer.status}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 -mt-8 relative">
              <p className="text-blue-500 font-bold tracking-[0.3em] text-[10px] uppercase mb-1">
                {selectedPlayer.playerType}
              </p>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-6">
                {selectedPlayer.name}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-slate-500 text-[10px] uppercase font-bold mb-1">Status</p>
                  <p className={`text-xl font-black uppercase ${
                    selectedPlayer.status === 'sold' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {selectedPlayer.status}
                  </p>
                </div>

                {selectedPlayer.status === 'sold' && (
                  <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                    <p className="text-emerald-500/60 text-[10px] uppercase font-bold mb-1">Sold Price</p>
                    <p className="text-xl font-black text-white font-mono">
                      {selectedPlayer.price || selectedPlayer.soldPrice || 0} PTS
                    </p>
                  </div>
                )}
              </div>

              {selectedPlayer.status === 'sold' && (
                <div className="mt-4 bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                   <span className="text-slate-500 text-xs font-bold uppercase">Team Owners</span>
                   <span className="text-white font-black uppercase italic">{selectedPlayer.soldTo}</span>
                </div>
              )}

              <div className="mt-6 text-center border-t border-slate-900 pt-4">
                <p className="text-slate-700 text-[8px] font-black uppercase tracking-[0.3em]">
                    KSL Season 3 Master Roster
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}