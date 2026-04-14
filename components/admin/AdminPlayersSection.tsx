'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Image from 'next/image';

interface Player {
  _id: string;
  name: string;
  playerType: string;
  photo?: string;
  isIcon: boolean;
  isSold: boolean;
  soldPrice?: number;
  soldTo?: any;
}

export default function AdminPlayersSection() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    playerType: 'All-rounder',
    photo: '',
    isIcon: false,
  });
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Failed to fetch players');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async () => {
    if (!newPlayer.name.trim()) {
      toast.error('Please enter a player name');
      return;
    }

    const icons = players.filter((p) => p.isIcon).length;
    const regularPlayers = players.filter((p) => !p.isIcon).length;

    if (newPlayer.isIcon && icons >= 6) {
      toast.error('You can only have 6 icon players');
      return;
    }

    if (!newPlayer.isIcon && regularPlayers >= 54) {
      toast.error('You can only have 54 regular players');
      return;
    }

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlayer),
      });

      if (response.ok) {
        toast.success('Player added successfully');
        setNewPlayer({ name: '', playerType: 'All-rounder', photo: '', isIcon: false });
        setPhotoPreview('');
        fetchPlayers();
      } else {
        toast.error('Failed to add player');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Error adding player');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setNewPlayer({ ...newPlayer, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const icons = players.filter((p) => p.isIcon && !p.isSold);
  const regularPlayers = players.filter((p) => !p.isIcon && !p.isSold);

  if (loading) {
    return <div className="text-white">Loading players...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Add New Player</CardTitle>
          <CardDescription>
            Icons: {players.filter((p) => p.isIcon).length}/6 | Regular: {players.filter((p) => !p.isIcon).length}/54
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Player name"
              value={newPlayer.name}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <select
              value={newPlayer.playerType}
              onChange={(e) =>
                setNewPlayer({ ...newPlayer, playerType: e.target.value })
              }
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              <option value="Raider">Raider</option>
              <option value="Defender">Defender</option>
              <option value="All-rounder">All-rounder</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
            />
            {photoPreview && (
              <div className="relative w-20 h-20">
                <Image
                  src={photoPreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={newPlayer.isIcon}
              onChange={(e) =>
                setNewPlayer({ ...newPlayer, isIcon: e.target.checked })
              }
              className="w-4 h-4 rounded"
            />
            <span className="text-white">Is Icon Player</span>
          </label>

          <Button onClick={handleAddPlayer} className="w-full bg-primary hover:bg-primary/90">
            Add Player
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Icon Players ({icons.length}/6)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {icons.map((player) => (
              <Card key={player._id} className="bg-slate-800 border-yellow-500 border-2">
                {player.photo && (
                  <div className="relative h-32 w-full">
                    <Image
                      src={player.photo}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="pt-4">
                  <h4 className="font-bold text-white mb-1">{player.name}</h4>
                  <p className="text-sm text-primary font-semibold mb-2">Icon Player</p>
                  <p className="text-xs text-gray-400">{player.playerType}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Regular Players ({regularPlayers.length}/54)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regularPlayers.map((player) => (
              <Card key={player._id} className="bg-slate-800 border-slate-700">
                {player.photo && (
                  <div className="relative h-24 w-full">
                    <Image
                      src={player.photo}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardContent className="pt-3">
                  <h4 className="font-bold text-white text-sm mb-1">{player.name}</h4>
                  <p className="text-xs text-gray-400">{player.playerType}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
