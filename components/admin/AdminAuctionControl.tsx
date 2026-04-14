'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
}

interface Team {
  _id: string;
  name: string;
  color: string;
  remainingPoints: number;
}

interface Auction {
  _id: string;
  stage: string;
  currentPlayer?: Player;
  currentPrice: number;
  iconsRemaining: number;
  playersRemaining: number;
  auctionHistory: any[];
}

export default function AdminAuctionControl() {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [auctionRes, teamsRes, playersRes] = await Promise.all([
        fetch('/api/auction'),
        fetch('/api/teams'),
        fetch('/api/players'),
      ]);

      const auctionData = await auctionRes.json();
      const teamsData = await teamsRes.json();
      const playersData = await playersRes.json();

      setAuction(auctionData);
      setTeams(teamsData);

      // Filter available players based on auction stage
      if (auctionData.stage === 'icon') {
        setAvailablePlayers(playersData.filter((p: Player) => p.isIcon && !p.isSold));
      } else {
        setAvailablePlayers(playersData.filter((p: Player) => !p.isIcon && !p.isSold));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrentPlayer = async () => {
    if (!selectedPlayer) {
      toast.error('Please select a player');
      return;
    }

    try {
      const response = await fetch('/api/auction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setCurrentPlayer',
          playerId: selectedPlayer,
        }),
      });

      if (response.ok) {
        toast.success('Player set for auction');
        setSelectedPlayer('');
        fetchData();
      } else {
        toast.error('Failed to set player');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error setting player');
    }
  };

  const handleSellPlayer = async () => {
    if (!selectedTeam) {
      toast.error('Please select a team');
      return;
    }

    if (!auction?.currentPlayer) {
      toast.error('No player selected for auction');
      return;
    }

    try {
      const response = await fetch('/api/auction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sellPlayer',
          playerId: auction.currentPlayer._id,
          teamId: selectedTeam,
          price: auction.currentPrice,
        }),
      });

      if (response.ok) {
        toast.success('Player sold successfully');
        setSelectedTeam('');
        fetchData();
      } else {
        toast.error('Failed to sell player');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error selling player');
    }
  };

  if (loading) {
    return <div className="text-white">Loading auction data...</div>;
  }

  if (!auction) {
    return <div className="text-white">No auction found</div>;
  }

  const soldTeam = teams.find((t) => t._id === selectedTeam);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Live Auction</CardTitle>
          <CardDescription className="text-blue-200">
            Stage: <span className="font-bold uppercase">{auction.stage}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-700 rounded p-4">
              <p className="text-blue-200 text-sm">Icons Remaining</p>
              <p className="text-3xl font-bold text-white">{auction.iconsRemaining}</p>
            </div>
            <div className="bg-blue-700 rounded p-4">
              <p className="text-blue-200 text-sm">Players Remaining</p>
              <p className="text-3xl font-bold text-white">{auction.playersRemaining}</p>
            </div>
            <div className="bg-blue-700 rounded p-4">
              <p className="text-blue-200 text-sm">Current Price</p>
              <p className="text-3xl font-bold text-primary">{auction.currentPrice}</p>
            </div>
            <div className="bg-blue-700 rounded p-4">
              <p className="text-blue-200 text-sm">Sold</p>
              <p className="text-3xl font-bold text-white">
                {auction.auctionHistory.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {auction.currentPlayer ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Now Auctioning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {auction.currentPlayer.photo && (
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src={auction.currentPlayer.photo}
                  alt={auction.currentPlayer.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">
                {auction.currentPlayer.name}
              </h3>
              <p className="text-primary text-lg font-semibold">
                {auction.currentPlayer.playerType}
              </p>
              {auction.currentPlayer.isIcon && (
                <p className="text-yellow-400 font-bold">★ ICON PLAYER ★</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2 text-sm font-semibold">
                  Select Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="">Choose a team...</option>
                  {teams
                    .filter((t) => t.remainingPoints >= auction.currentPrice)
                    .map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name} ({team.remainingPoints} points left)
                      </option>
                    ))}
                </select>
              </div>

              {soldTeam && (
                <div className="bg-gradient-to-r from-green-900 to-green-800 rounded p-4">
                  <p className="text-green-200 text-sm">Selling to</p>
                  <p className="text-2xl font-bold text-white">{soldTeam.name}</p>
                  <p className="text-green-300">Price: {auction.currentPrice} points</p>
                </div>
              )}

              <Button
                onClick={handleSellPlayer}
                disabled={!selectedTeam}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
              >
                SELL PLAYER
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Select Player for Auction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              <option value="">Choose a player...</option>
              {availablePlayers.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name} - {player.playerType}
                  {player.isIcon ? ' (ICON)' : ''}
                </option>
              ))}
            </select>

            <Button
              onClick={handleSetCurrentPlayer}
              disabled={!selectedPlayer}
              className="w-full bg-primary hover:bg-primary/90 h-12 text-lg"
            >
              SET FOR AUCTION
            </Button>

            {availablePlayers.length === 0 && (
              <p className="text-gray-400 text-center">
                No more {auction.stage === 'icon' ? 'icon' : 'regular'} players available
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {auction.auctionHistory.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Auction History</CardTitle>
            <CardDescription>Last {Math.min(10, auction.auctionHistory.length)} sold players</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {[...auction.auctionHistory]
                .reverse()
                .slice(0, 10)
                .map((history, idx) => (
                  <div key={idx} className="bg-slate-700 rounded p-3 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">
                        {history.player?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Sold to: {history.soldTo?.name || 'Unknown'}
                      </p>
                    </div>
                    <p className="text-primary font-bold text-lg">{history.price} pts</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
