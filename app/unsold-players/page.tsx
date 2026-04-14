
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Player {
  _id: string;
  name: string;
  playerType: string;
  photo: string;
  status: string;
  isIcon?: boolean;
}

export default function UnsoldPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ksl_players');
    if (saved) {
      setPlayers(JSON.parse(saved));
    }
  }, []);

  const handleReAuction = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal when clicking the button
    const updated = players.map(p => 
      p._id === id ? { ...p, status: 'available' } : p
    );
    setPlayers(updated);
    localStorage.setItem('ksl_players', JSON.stringify(updated));
  };

  const unsold = players.filter(p => p.status === 'unsold');

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-[#0a0a0c] p-6 rounded-2xl border border-slate-900 shadow-2xl">
          <div className="flex items-center gap-6">
            <Link href="/">
              <button className="text-slate-500 hover:text-white font-bold uppercase text-[10px] tracking-widest border border-slate-800 px-3 py-1.5 rounded-lg transition-all">
                ← Back
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Unsold Pool</h1>
              <p className="text-red-500 font-bold tracking-[0.3em] text-[10px] mt-1 uppercase">Awaiting Re-Auction</p>
            </div>
          </div>
          <div className="bg-black/40 px-6 py-2 rounded-xl border border-slate-800 text-right">
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Count</p>
            <p className="text-2xl font-mono font-black text-red-500 leading-none">{unsold.length}</p>
          </div>
        </div>

        {unsold.length > 0 ? (
          /* Grid of Small Horizontal Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unsold.map((p) => (
              <div 
                key={p._id} 
                onClick={() => setSelectedPlayer(p)}
                className={`relative bg-[#0a0a0c] border p-3 rounded-2xl flex items-center gap-4 transition-all shadow-lg cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  p.isIcon 
                  ? 'border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-transparent' 
                  : 'border-slate-800 hover:border-red-500/30'
                }`}
              >
                {/* Icon Badge */}
                {p.isIcon && (
                  <div className="absolute -top-2 -right-1 bg-yellow-500 text-black font-black text-[8px] px-2 py-0.5 rounded-full shadow-lg z-10 italic">
                    ICON
                  </div>
                )}

                {/* Compact Photo */}
                <div className="relative shrink-0">
                  <img 
                    src={p.photo || '/placeholder.png'} 
                    className={`w-14 h-14 rounded-xl object-cover border-2 grayscale brightness-75 ${
                      p.isIcon ? 'border-yellow-500' : 'border-slate-800'
                    }`} 
                    alt={p.name} 
                  />
                </div>

                {/* Player Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black uppercase italic truncate leading-none mb-1">
                    {p.name}
                  </h3>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mb-2">
                    {p.playerType}
                  </p>

                  <button 
                    onClick={(e) => handleReAuction(p._id, e)}
                    className="w-full bg-slate-900 hover:bg-red-600/20 text-slate-500 hover:text-red-500 border border-slate-800 hover:border-red-500/50 font-black py-1.5 rounded-lg text-[8px] uppercase tracking-widest transition-all"
                  >
                    Re-Auction
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-900 rounded-[40px] bg-[#0a0a0c]/50">
            <p className="text-slate-700 font-black uppercase tracking-[0.5em] text-sm italic">No Unsold Players</p>
          </div>
        )}
      </div>

      {/* --- BIG FOCUSED PLAYER MODAL --- */}
      {selectedPlayer && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-all animate-in fade-in duration-300"
          onClick={() => setSelectedPlayer(null)}
        >
          <div 
            className="relative bg-[#0a0a0c] border-2 border-slate-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-6 right-6 z-10 text-slate-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Big Photo Container */}
            <div className="relative h-96 w-full">
              <img 
                src={selectedPlayer.photo || '/placeholder.png'} 
                className="w-full h-full object-cover grayscale brightness-50"
                alt={selectedPlayer.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
              
              <div className="absolute top-6 left-6 flex gap-2">
                {selectedPlayer.isIcon && (
                  <div className="bg-yellow-500 text-black font-black px-4 py-1 rounded-full italic tracking-tighter text-sm">
                    ICON PLAYER
                  </div>
                )}
                <div className="bg-red-600 text-white font-black px-4 py-1 rounded-full italic tracking-tighter text-sm">
                  UNSOLD
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-10 -mt-16 relative">
              <p className="text-red-500 font-bold tracking-[0.4em] text-xs uppercase mb-2">
                {selectedPlayer.playerType}
              </p>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-8">
                {selectedPlayer.name}
              </h2>

              {/* Status Card */}
              <div className="bg-gradient-to-r from-red-600/10 to-transparent p-6 rounded-3xl border border-red-500/20 flex justify-between items-center">
                 <div>
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-1 tracking-widest">Current Status</p>
                    <p className="text-2xl font-black text-red-500 uppercase italic leading-none">Not Sold</p>
                 </div>
                 <button 
                  onClick={(e) => {
                    handleReAuction(selectedPlayer._id, e);
                    setSelectedPlayer(null);
                  }}
                  className="bg-white text-black font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                 >
                    Move to Auction
                 </button>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em]">KSL Season 3 Auction Pool</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}