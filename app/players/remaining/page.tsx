'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface Player {
  _id: string;
  name: string;
  playerType: string;
  photo?: string;
  isIcon: boolean;
  status: 'available' | 'sold';
  soldTo?: string;
  soldPrice?: number;
}

export default function PlayersRemainingPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/players');
      if (res.ok) {
        const data = await res.json();
        setPlayers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const remainingPlayers = players.filter(p => p.status === 'available').sort((a, b) => {
    if (a.isIcon !== b.isIcon) return b.isIcon ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-semibold">Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">KSL Season 3 - Players Remaining</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Available Players</h2>
          <p className="text-gray-400">Total: {remainingPlayers.length} players</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {remainingPlayers.map(player => (
            <Card key={player._id} className="bg-slate-800 border-slate-700 overflow-hidden hover:border-primary transition-colors">
              <CardContent className="p-3">
                {player.photo && (
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
                    <Image
                      src={player.photo}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                    {player.isIcon && (
                      <div className="absolute top-1 right-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                        ★
                      </div>
                    )}
                  </div>
                )}
                <h4 className="font-bold text-white text-sm mb-1 truncate">{player.name}</h4>
                <p className="text-primary text-xs font-semibold">{player.playerType}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {remainingPlayers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No players remaining</p>
          </div>
        )}
      </main>
    </div>
  );
}
