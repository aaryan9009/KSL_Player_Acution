
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UnsoldPlayers() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUnsoldPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      if (res.ok) {
        const allPlayers = await res.json();
        const unsold = allPlayers.filter((p: any) => p.status === 'unsold');
        setPlayers(unsold);
      }
    } catch (err) {
      console.error("Failed to fetch players:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReAuction = async (playerId: string) => {
    try {
      const res = await fetch('/api/players/reauction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId })
      });

      if (res.ok) {
        // Navigate back to main auction room where the player will now be visible
        router.push('/');
      } else {
        alert("Failed to move player back to auction.");
      }
    } catch (err) {
      alert("Error connecting to server.");
    }
  };

  useEffect(() => {
    fetchUnsoldPlayers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-blue-500 font-black animate-pulse tracking-widest uppercase">
          Loading Unsold Pool...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">
              Unsold <span className="text-red-500">Players</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
              Secondary pool: {players.length} players available for re-auction
            </p>
          </div>
          <Link href="/">
            <button className="mt-4 md:mt-0 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-black px-6 py-3 rounded-xl transition-all text-xs tracking-widest uppercase">
              ← Return to Auction
            </button>
          </Link>
        </div>

        {players.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {players.map((player) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={player._id}
                className="bg-[#0f0f12] border border-slate-800 rounded-3xl overflow-hidden hover:border-red-500/50 transition-all group"
              >
                <div className="relative h-64 w-full">
                  <img
                    src={player.photo || '/placeholder.png'}
                    alt={player.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg">
                      Unsold
                    </span>
                    {player.isIcon && (
                      <span className="bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-lg italic">
                        Icon
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-black uppercase italic mb-1 group-hover:text-red-400 transition-colors">
                    {player.name}
                  </h3>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mb-4">
                    {player.playerType}
                  </p>
                  
                  <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                    <div className="text-left">
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-tighter">Base Price</p>
                      <p className="text-emerald-400 font-mono font-bold text-lg leading-none">
                        {player.isIcon ? '5' : '1'} <span className="text-[10px]">PTS</span>
                      </p>
                    </div>
                    
                    {/* TRIGGER RE-AUCTION LOGIC */}
                    <button 
                      onClick={() => handleReAuction(player._id)}
                      className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-white transition-colors"
                    >
                      Re-Auction →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 border-2 border-dashed border-slate-900 rounded-[40px]">
            <p className="text-slate-700 text-2xl font-black italic uppercase tracking-tighter">
              Unsold Pool Empty
            </p>
            <p className="text-slate-800 text-sm font-bold uppercase tracking-[0.3em] mt-2">
              All players have been successfully auctioned
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
