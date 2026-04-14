


'use client';

import { useState, useEffect } from 'react';

interface Player {
  _id: string;
  name: string;
  playerType: string;
  photo: string;
  status: string;
  soldTo?: string;
  price?: number;
  isIcon?: boolean;
}

export default function SoldPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ksl_players');
    if (saved) {
      setPlayers(JSON.parse(saved));
    }
  }, []);

  const soldPlayers = players.filter(p => p.status === 'sold');

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Compact Header */}
        <div className="flex justify-between items-center mb-8 bg-[#0a0a0c] p-6 rounded-2xl border border-slate-900 shadow-2xl">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Sold Players</h1>
            <p className="text-blue-500 font-bold tracking-[0.3em] text-[10px] mt-1 uppercase">KSL Season 3 Auction Log</p>
          </div>
          <div className="bg-black/40 px-6 py-2 rounded-xl border border-slate-800 text-right">
            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Players Drafted</p>
            <p className="text-2xl font-mono font-black text-emerald-500 leading-none">{soldPlayers.length}</p>
          </div>
        </div>

        {soldPlayers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {soldPlayers.map((player) => (
              <div 
                key={player._id} 
                onClick={() => setSelectedPlayer(player)}
                className={`bg-[#0a0a0c] border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  player.isIcon 
                  ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-transparent' 
                  : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center p-3.5 gap-4">
                  <div className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
                    player.isIcon ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border-slate-800'
                  }`}>
                    <img 
                      src={player.photo || '/placeholder.png'} 
                      alt={player.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-black text-[14px] uppercase italic truncate leading-none mb-1 tracking-tight ${
                      player.isIcon ? 'text-yellow-500' : 'text-white'
                    }`}>
                      {player.name}
                    </h3>
                    <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-2">
                      {player.playerType}
                    </p>
                    <div className="flex flex-col">
                      <span className="text-[6px] text-slate-600 font-black uppercase tracking-tighter">Sold To</span>
                      <span className="text-blue-400 font-black text-[10px] uppercase truncate italic">
                        {player.soldTo}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-xl font-mono font-black leading-none ${
                      player.isIcon ? 'text-yellow-500' : 'text-emerald-400'
                    }`}>
                      {player.price || 0}
                    </p>
                    <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-1">Points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-900 rounded-[40px] bg-[#0a0a0c]/50">
            <p className="text-slate-700 font-black uppercase tracking-[0.5em] text-sm italic">No players sold yet</p>
          </div>
        )}
      </div>

      {/* --- BIG PLAYER FOCUS MODAL --- */}
      {selectedPlayer && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-all"
          onClick={() => setSelectedPlayer(null)}
        >
          <div 
            className="relative bg-[#0a0a0c] border-2 border-slate-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
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

            {/* Big Photo Section */}
            <div className="relative h-80 w-full">
              <img 
                src={selectedPlayer.photo || '/placeholder.png'} 
                className="w-full h-full object-cover"
                alt={selectedPlayer.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
              
              {selectedPlayer.isIcon && (
                <div className="absolute top-6 left-6 bg-yellow-500 text-black font-black px-4 py-1 rounded-full italic tracking-tighter text-sm">
                  ICON PLAYER
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-10 -mt-16 relative">
              <p className="text-blue-500 font-bold tracking-[0.4em] text-xs uppercase mb-2">
                {selectedPlayer.playerType}
              </p>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-8">
                {selectedPlayer.name}
              </h2>

              {/* Auction Result Card */}
              <div className="bg-gradient-to-r from-blue-600/10 to-emerald-600/10 p-6 rounded-3xl border border-white/10 flex justify-between items-center">
                 <div>
                    <p className="text-slate-500 text-[10px] uppercase font-black mb-1 tracking-widest">Sold To Team</p>
                    <p className="text-2xl font-black text-white uppercase italic">{selectedPlayer.soldTo}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-emerald-500 text-[10px] uppercase font-black mb-1 tracking-widest">Final Bid</p>
                    <p className="text-4xl font-mono font-black text-white">
                      {selectedPlayer.price || 0} <span className="text-sm">PTS</span>
                    </p>
                 </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-slate-700 text-[10px] font-black uppercase tracking-[0.3em]">KSL Season 3 Official Roster</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}