'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface History {
  player?: any;
  soldTo?: any;
  price: number;
  isIcon: boolean;
  soldAt: string;
}

interface Auction {
  auctionHistory: History[];
}

export default function AuctionHistory() {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuction();
    const interval = setInterval(fetchAuction, 2000);
    return () => clearInterval(interval);
  }, []);

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
    return <div className="text-gray-400">Loading history...</div>;
  }

  const history = auction?.auctionHistory || [];
  const displayHistory = [...history].reverse().slice(0, 8);

  if (displayHistory.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-400">No players sold yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {displayHistory.map((item, idx) => (
        <Card
          key={idx}
          className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-slate-900/50 overflow-hidden group"
        >
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              {/* Player Photo */}
              {item.player?.photo && (
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.player.photo}
                    alt={item.player.name}
                    fill
                    className="object-cover"
                  />
                  {item.isIcon && (
                    <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                      <span className="text-yellow-300 font-bold text-xs">ICON</span>
                    </div>
                  )}
                </div>
              )}

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate group-hover:text-primary transition-colors">
                  {item.player?.name || 'Unknown'}
                </h4>
                <p className="text-sm text-gray-400">
                  {item.player?.playerType || 'Unknown'}
                </p>
              </div>

              {/* Team Info */}
              <div className="text-right space-y-1">
                <p className="text-sm text-gray-400">Sold to</p>
                <p
                  className="font-bold text-white text-sm"
                  style={{
                    color: item.soldTo?.color || '#ffffff',
                  }}
                >
                  {item.soldTo?.name || 'Unknown'}
                </p>
              </div>

              {/* Price */}
              <div className="text-right ml-4 flex-shrink-0">
                <p className="text-xs text-gray-400 mb-1">Points</p>
                <p
                  className="text-2xl font-bold"
                  style={{
                    color: item.soldTo?.color || '#ff6b35',
                  }}
                >
                  {item.price}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
