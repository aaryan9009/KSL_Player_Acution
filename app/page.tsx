'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { INITIAL_PLAYERS } from '@/lib/playersData'; 
import { INITIAL_TEAMS } from '@/lib/teamsData';

interface Player {
  _id: string;
  name: string;
  playerType: string;
  photo: string;
  isIcon: boolean;
  status: string;
  soldTo?: string;
  price?: number;
}

interface Team {
  _id: string;
  name: string;
  logo: string;
  pointsUsed: number;
}

export default function AuctionRoom() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [soldPrice, setSoldPrice] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    const savedPlayers = localStorage.getItem('ksl_players');
    const savedTeams = localStorage.getItem('ksl_teams');
    setPlayers(savedPlayers ? JSON.parse(savedPlayers) : INITIAL_PLAYERS);
    setTeams(savedTeams ? JSON.parse(savedTeams) : INITIAL_TEAMS);
  }, []);

  useEffect(() => {
    if (players.length > 0) localStorage.setItem('ksl_players', JSON.stringify(players));
    if (teams.length > 0) localStorage.setItem('ksl_teams', JSON.stringify(teams));
  }, [players, teams]);

  const handleSell = () => {
    if (!activePlayer || !selectedTeam || !soldPrice) {
        alert("Select team and price!");
        return;
    }
    
    const price = parseInt(soldPrice);
    const targetTeam = teams.find(t => t.name === selectedTeam);

    if (!targetTeam) return;

    const remPoints = 100 - (targetTeam.pointsUsed || 0);
    if (price > remPoints) {
        alert("Insufficient Points!");
        return;
    }

    setPlayers((prev) => prev.map(p => 
      p._id === activePlayer._id ? { ...p, status: 'sold', soldTo: selectedTeam, price } : p
    ));

    setTeams((prev) => prev.map(t => 
      t.name === selectedTeam ? { ...t, pointsUsed: (t.pointsUsed || 0) + price } : t
    ));

    setActivePlayer(null);
    setSoldPrice('');
    setSelectedTeam('');
  };

  const handleUnsold = () => {
    if (!activePlayer) return;
    setPlayers(prev => prev.map(p => p._id === activePlayer._id ? { ...p, status: 'unsold' } : p));
    setActivePlayer(null);
  };

  const remainingPool = players.filter(p => p.status === 'available');

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#050505] text-white overflow-hidden font-sans">
      
      {/* SIDEBAR - Compact for Projector */}
      <aside className="w-70 bg-[#0a0a0c] border-r border-slate-900 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-blue-500 tracking-[0.2em] uppercase">Pool ({remainingPool.length})</h3>
            <button 
                onClick={() => { if(confirm("Reset Auction?")) { localStorage.clear(); window.location.reload(); } }}
                className="text-[8px] text-red-500 font-bold border border-red-500/20 px-2 py-0.5 rounded hover:bg-red-500/10"
            >
                RESET
            </button>
        </div>
        <div className="space-y-1.5">
          {remainingPool.map(p => (
            <div 
              key={p._id} 
              onClick={() => setActivePlayer(p)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                activePlayer?._id === p._id ? 'bg-blue-600 border-blue-400' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-xs truncate">{p.name}</p>
                {p.isIcon && <span className="text-[7px] bg-yellow-500 text-black px-1 rounded font-black">ICON</span>}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN AUCTION STAGE */}
      <main className="flex-1 flex flex-col items-center justify-between py-4 px-6 relative">
        
        {/* Fixed height container to prevent layout shift */}
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-125">
          <AnimatePresence mode="wait">
            {activePlayer ? (
              <motion.div 
                key={activePlayer._id} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="flex flex-col items-center"
              >
                <div className="relative p-2 bg-blue-500/10 rounded-[40px] border border-blue-500/20">
                  <img src={activePlayer.photo} className="w-66 h-66 object-cover rounded-4xl shadow-2xl" alt={activePlayer.name} />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 px-6 py-1 rounded-full font-black text-xs border-2 border-black whitespace-nowrap shadow-xl">
                    BASE: {activePlayer.isIcon ? '5 PTS' : '1 PT'}
                  </div>
                </div>

                <h2 className="text-6xl font-black italic uppercase mt-6 tracking-tighter text-center">{activePlayer.name}</h2>
                <p className="text-blue-500 font-bold tracking-[0.5em] uppercase text-xs mb-6">{activePlayer.playerType}</p>

                <div className="bg-[#111114] border border-slate-800 p-5 rounded-3xl flex items-end gap-3 shadow-2xl">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase ml-1">Price</p>
                    <input type="number" value={soldPrice} onChange={(e) => setSoldPrice(e.target.value)} className="bg-black border border-slate-700 rounded-xl px-4 py-2.5 w-24 text-emerald-400 text-xl font-mono outline-none" placeholder="0" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase ml-1">Team</p>
                    <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="bg-black border border-slate-700 rounded-xl px-4 py-3 min-w-40 text-sm text-white outline-none">
                      <option value="">Assign Team</option>
                      {teams.map(t => <option key={t._id} value={t.name}>{t.name} ({100 - t.pointsUsed} Left)</option>)}
                    </select>
                  </div>
                  <button onClick={handleSell} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-3.5 rounded-xl text-sm transition-transform active:scale-95">SOLD</button>
                  <button onClick={handleUnsold} className="bg-red-600 hover:bg-red-500 text-white font-black px-6 py-3.5 rounded-xl text-sm transition-transform active:scale-95">UNSOLD</button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center opacity-15 select-none">
                <h1 className="text-9xl font-black italic">KSL S3</h1>
                <p className="tracking-[1em] text-sm">KUTWAD SUPER LEAGUE</p>
                <p className="tracking-[1em] text-sm">AUCTION LIVE</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM TEAM DASHBOARD - Clickable */}
        <div className="grid grid-cols-6 gap-3 w-full max-w-6xl pb-2">
          {teams.map(team => (
            <Link href={`/team/${encodeURIComponent(team.name)}`} key={team._id}>
              <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-2xl text-center cursor-pointer transition-all hover:border-blue-500 active:scale-95">
                <img src={team.logo} className="w-10 h-10 mx-auto mb-1 object-contain" alt={team.name} />
                <p className="text-[9px] font-black text-white uppercase truncate mb-1">{team.name}</p>
                <div className="bg-black/50 rounded-lg py-1 border border-slate-800">
                  <p className="text-lg font-mono font-bold text-emerald-400 leading-none">{100 - (team.pointsUsed || 0)}</p>
                  <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">Points</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
