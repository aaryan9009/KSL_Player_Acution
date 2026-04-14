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

  useEffect(() => {
    const savedPlayers = localStorage.getItem('ksl_players');
    const savedTeams = localStorage.getItem('ksl_teams');

    if (savedPlayers && savedTeams) {
      const allPlayers = JSON.parse(savedPlayers);
      const allTeams = JSON.parse(savedTeams);

      // Filter and Sort: Icon players first, then by price descending
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
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
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
          
          <div className="bg-black/60 border border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-6">
            <div className="text-right">
              <p className="text-slate-600 text-[8px] uppercase font-black tracking-widest mb-0.5">Budget Left</p>
              <p className="text-3xl font-mono font-bold text-emerald-400 leading-none">{remainingPoints}</p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-right">
              <p className="text-slate-600 text-[8px] uppercase font-black tracking-widest mb-0.5">Spent</p>
              <p className="text-3xl font-mono font-bold text-blue-500 leading-none">{team?.pointsUsed || 0}</p>
            </div>
          </div>
        </div>

        {/* Unified Squad Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {players.length > 0 ? (
            players.map((player) => (
              <PlayerCard key={player._id} player={player} />
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
    </div>
  );
}

function PlayerCard({ player }: { player: any }) {
  const isIcon = player.isIcon;

  return (
    <Card className={`bg-[#0a0a0c] border-slate-800 overflow-hidden transition-all duration-300 ${
      isIcon 
      ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-transparent ring-1 ring-yellow-500/20' 
      : 'hover:border-blue-500/40'
    }`}>
      <div className="flex items-center p-3.5 gap-4">
        {/* Photo Container */}
        <div className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 ${
          isIcon ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'border-slate-800'
        }`}>
          <img 
            src={player.photo || '/placeholder.png'} 
            alt={player.name} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Info Section */}
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

        {/* Price Section */}
        <div className="text-right shrink-0">
          <p className={`text-xl font-mono font-black leading-none ${
            isIcon ? 'text-yellow-500' : 'text-emerald-400'
          }`}>
            {player.price || 0}
          </p>
          <p className="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-1">Points</p>
          {isIcon && (
            <div className="mt-1 flex justify-end">
              <span className="text-[7px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-black italic">
                ICON
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}