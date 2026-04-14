'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { toast } from 'sonner';

interface Player {
  _id: string;
  name: string;
  playerType: string;
  photo?: string;
  isIcon: boolean;
}

interface Auction {
  _id: string;
  stage: string;
  currentPlayer?: Player;
  currentPrice: number;
  iconsRemaining: number;
  playersRemaining: number;
}

export default function LiveAuction() {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    fetchAuction();
    const interval = setInterval(fetchAuction, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setShowAnimation(false);
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, [auction?.currentPlayer?._id]);

  const fetchAuction = async () => {
    try {
      const response = await fetch('/api/auction');
      const data = await response.json();
      setAuction(data);
    } catch (error) {
      console.error('Error fetching auction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">Loading auction...</div>
        </CardContent>
      </Card>
    );
  }

  if (!auction) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="text-center text-gray-400">No auction data</div>
        </CardContent>
      </Card>
    );
  }

  // Auction completed
  if (auction.stage === 'completed') {
    return (
      <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
        <CardContent className="pt-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-white">🎉</h3>
            <p className="text-xl font-bold text-white">Auction Completed!</p>
            <p className="text-green-200">
              All {auction.auctionHistory?.length || 0} players have been sold
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No player currently being auctioned
  if (!auction.currentPlayer) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-8">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-slate-700 rounded-full animate-pulse" />
            <p className="text-gray-400">
              {auction.stage === 'icon'
                ? 'Preparing next icon player...'
                : 'Preparing next player...'}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="text-gray-400">
                {auction.stage === 'icon' ? 'Icons remaining: ' : 'Players remaining: '}
                <span className="text-primary font-bold">
                  {auction.iconsRemaining + auction.playersRemaining}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-gradient-to-br from-slate-800 to-slate-900 border-2 transition-all duration-300 ${
        auction.currentPlayer.isIcon
          ? 'border-yellow-500 shadow-lg shadow-yellow-500/20'
          : 'border-slate-700 shadow-lg shadow-slate-700/20'
      }`}
    >
      <CardContent className={`pt-6 space-y-6 transition-all duration-500 ${
        showAnimation ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Player Image */}
        {auction.currentPlayer.photo && (
          <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden shadow-lg">
            <Image
              src={auction.currentPlayer.photo}
              alt={auction.currentPlayer.name}
              fill
              className="object-cover"
              priority
            />
            {auction.currentPlayer.isIcon && (
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                ★ ICON ★
              </div>
            )}
          </div>
        )}

        {/* Player Info */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-balance">
            {auction.currentPlayer.name}
          </h2>
          <p className="text-lg text-gray-300 font-semibold">
            {auction.currentPlayer.playerType}
          </p>
        </div>

        {/* Price Display */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-center">
          <p className="text-gray-100 text-sm font-semibold mb-2">CURRENT BID</p>
          <p className="text-5xl md:text-6xl font-bold text-white animate-pulse">
            {auction.currentPrice}
          </p>
          <p className="text-gray-200 mt-2">
            {auction.currentPlayer.isIcon ? 'Icon' : 'Player'} Points
          </p>
        </div>

        {/* Stage Info */}
        <div className="bg-slate-700 rounded-lg p-4 text-center">
          <p className="text-gray-300 text-sm mb-2">AUCTION STAGE</p>
          <div className="flex justify-center gap-4 text-lg font-bold">
            <span
              className={`px-4 py-2 rounded-lg transition-all ${
                auction.stage === 'icon'
                  ? 'bg-yellow-500 text-yellow-900'
                  : 'bg-slate-600 text-gray-300'
              }`}
            >
              Icons: {auction.iconsRemaining}
            </span>
            <span
              className={`px-4 py-2 rounded-lg transition-all ${
                auction.stage === 'player'
                  ? 'bg-blue-500 text-blue-900'
                  : 'bg-slate-600 text-gray-300'
              }`}
            >
              Players: {auction.playersRemaining}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
