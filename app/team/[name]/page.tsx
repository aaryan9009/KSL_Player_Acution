'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TeamPage({ params }: { params: Promise<{ name: string }> }) {
  const resolvedParams = use(params);
  const decodedTeamName = decodeURIComponent(resolvedParams.name);

  const [players, setPlayers] = useState<any[]>([]);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  // State for the Squad List View
  const [showListView, setShowListView] = useState(false);

  useEffect(() => {
    const savedPlayers = localStorage.getItem('ksl_players');
    const savedTeams = localStorage.getItem('ksl_teams');

    if (savedPlayers && savedTeams) {
      const allPlayers = JSON.parse(savedPlayers);
      const allTeams = JSON.parse(savedTeams);

      const teamPlayers = allPlayers
        .filter((p: any) => p.soldTo === decodedTeamName)
        .sort((a: any, b: any) => (b.isIcon ? 1 : 0) - (a.isIcon ? 1 : 0));
        
      const currentTeam = allTeams.find((t: any) => t.name === decodedTeamName);

      setPlayers(teamPlayers);
      setTeam(currentTeam);
    }
    setLoading(false);
  }, [decodedTeamName]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-blue-500 font-black animate-pulse tracking-widest uppercase text-xs">Loading Squad...</div>
    </div>
  );

  const remainingPoints = 100 - (team?.pointsUsed || 0);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Navigation & Status */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-slate-500 hover:text-white font-bold uppercase text-[10px] tracking-widest p-0">
              ← Back to Auction
            </Button>
          </Link>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Squad View</span>
             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
          </div>
        </div>

        {/* Team Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#0a0a0c] p-6 rounded-[24px] border border-slate-900 shadow-2xl">
          <div className="flex items-center gap-6">
            {team?.logo && (
              <img src={team.logo} alt={decodedTeamName} className="w-20 h-20 object-contain" />
            )}
            <div>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-1">
                {decodedTeamName}
              </h1>
              <p className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.3em]">
                {players.length} Players Drafted
              </p>
            </div>
          </div>
          
          <div className="bg-black/60 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-6 mt-4 md:mt-0">
            <div className="text-right">
              <p className="text-slate-600 text-[8px] uppercase font-black tracking-widest mb-0.5">Budget Left</p>
              <p className="text-3xl font-mono font-bold text-emerald-400 leading-none">{remainingPoints}</p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-right pr-4">
              <p className="text-slate-600 text-[8px] uppercase font-black tracking-widest mb-0.5">Spent</p>
              <p className="text-3xl font-mono font-bold text-blue-500 leading-none">{team?.pointsUsed || 0}</p>
            </div>
            <button 
              onClick={() => setShowListView(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase px-4 py-2 rounded-xl transition-all tracking-tighter"
            >
              Squad List
            </button>
          </div>
        </div>

        {/* Unified Squad Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.length > 0 ? (
            players.map((player) => (
              <PlayerCard 
                key={player._id} 
                player={player} 
                onClick={() => setSelectedPlayer(player)} 
              />
            ))
          ) : (
            <div className="col-span-full bg-[#0a0a0c] border border-dashed border-slate-800 p-20 rounded-[32px] text-center">
              <p className="text-slate-700 font-black uppercase tracking-[0.4em] text-sm italic">
                Squad is currently empty
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- SQUAD LIST MODAL --- */}
      {showListView && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl transition-all"
          onClick={() => setShowListView(false)}
        >
          <div 
            className="relative bg-[#0a0a0c] border border-slate-800 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
                <div className="flex justify-between items-center mb-8 border-b border-slate-900 pb-4">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">{decodedTeamName} Roster</h2>
                    <button onClick={() => setShowListView(false)} className="text-slate-500 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {players.map((p, index) => (
                        <div key={p._id} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                            <span className="text-blue-500 font-mono font-black text-sm w-4">{index + 1}.</span>
                            <div className="flex-1">
                                <p className="font-black uppercase text-sm italic leading-none">{p.name}</p>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{p.playerType}</p>
                            </div>
                            {p.isIcon && (
                                <span className="bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded italic">ICON</span>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] font-black uppercase text-slate-600 tracking-widest">
                    <span>Total Players: {players.length}</span>
                    <span>KSL Season 3</span>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* --- COMPACT PLAYER FOCUS MODAL --- */}
      {selectedPlayer && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm transition-all"
          onClick={() => setSelectedPlayer(null)}
        >
          <div 
            className="relative bg-[#0a0a0c] border border-slate-800 w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPlayer(null)}
              className="absolute top-4 right-4 z-10 text-slate-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative h-80 w-full bg-slate-900">
              <img 
                src={selectedPlayer.photo || '/placeholder.png'} 
                className="w-full h-full object-cover"
                alt={selectedPlayer.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent" />
              
              {selectedPlayer.isIcon && (
                <div className="absolute top-6 left-6 bg-yellow-500 text-black font-black px-3 py-0.5 rounded-full italic tracking-tighter text-[10px]">
                  ICON PLAYER
                </div>
              )}
            </div>

            <div className="p-6 -mt-8 relative">
              <p className="text-blue-500 font-bold tracking-[0.3em] text-[10px] uppercase mb-1">
                {selectedPlayer.playerType}
              </p>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-6">
                {selectedPlayer.name}
              </h2>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                 <div>
                    <p className="text-slate-500 text-[8px] uppercase font-black mb-0.5 tracking-widest">Squad</p>
                    <p className="text-lg font-black text-white uppercase italic">{selectedPlayer.soldTo}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-emerald-500 text-[8px] uppercase font-black mb-0.5 tracking-widest">Purchase Price</p>
                    <p className="text-2xl font-mono font-black text-white">
                      {selectedPlayer.price || 0} <span className="text-[10px]">PTS</span>
                    </p>
                 </div>
              </div>
              
              <div className="mt-6 text-center border-t border-slate-900 pt-4">
                <p className="text-slate-700 text-[8px] font-black uppercase tracking-[0.3em]">KSL Season 3 Official Roster</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerCard({ player, onClick }: { player: any, onClick: () => void }) {
  const isIcon = player.isIcon;

  return (
    <Card 
      onClick={onClick}
      className={`bg-[#0a0a0c] border-slate-800 overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-95 ${
        isIcon 
        ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-transparent ring-1 ring-yellow-500/20' 
        : 'hover:border-blue-500/40'
      }`}
    >
      <div className="flex items-center p-2 gap-3">
        <div className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
          isIcon ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border-slate-800'
        }`}>
          <img 
            src={player.photo || '/placeholder.png'} 
            alt={player.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-black text-[15px] uppercase italic truncate leading-none mb-1.5 tracking-tight ${
            isIcon ? 'text-yellow-500' : 'text-white'
          }`}>
            {player.name}
          </h3>
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">
            {player.playerType}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className={`text-xl font-mono font-black leading-none ${
            isIcon ? 'text-yellow-500' : 'text-emerald-400'
          }`}>
            {player.price || 0}
          </p>
          <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-1">Points</p>
        </div>
      </div>
    </Card>
  );
}

