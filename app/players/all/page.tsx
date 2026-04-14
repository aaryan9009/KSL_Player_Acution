'use client';
import { useState, useEffect } from 'react';

export default function AllPlayers() {
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
  fetch('/api/players')
    .then(res => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then(data => setPlayers(data))
    .catch(err => console.error("Could not load players:", err));
}, []);

  useEffect(() => {
    fetch('/api/players').then(res => res.json()).then(data => setPlayers(data));
  }, []);

  return (
    <div className="p-8 bg-black min-h-screen">
      <h1 className="text-3xl font-black italic mb-8 border-l-4 border-blue-500 pl-4">ALL PLAYERS</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {players.map(p => (
          <div key={p._id} className="bg-[#0f0f12] border border-slate-800 rounded-2xl overflow-hidden p-4">
            <img src={p.photo} className="w-full h-48 object-cover rounded-xl mb-4" />
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-blue-500 text-sm font-bold uppercase">{p.playerType}</p>
            <p className={`mt-2 text-xs font-black ${p.status === 'sold' ? 'text-red-500' : 'text-emerald-500'}`}>
              STATUS: {p.status.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}