'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Team {
  _id: string;
  name: string;
  color: string;
  totalPoints: number;
  remainingPoints: number;
  icon?: any;
  players: any[];
}

export default function TeamsGrid() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  useEffect(() => {
    fetchTeams();
    const interval = setInterval(fetchTeams, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      setTeams(data.sort((a: Team, b: Team) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && teams.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-slate-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-400">No teams added yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <Link
          key={team._id}
          href={`/team/${team._id}`}
          className="block group"
        >
          <Card
            className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 cursor-pointer overflow-hidden"
            onClick={() => setSelectedTeamId(team._id)}
          >
            <div
              className="h-1 w-full transition-all duration-300 group-hover:h-2"
              style={{ backgroundColor: team.color }}
            />
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">
                      {team.name}
                    </h4>
                    {team.icon && (
                      <p className="text-xs text-primary font-semibold mt-1">
                        ★ {team.icon.name}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>

                <div className="space-y-2">
                  {/* Points Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Points</span>
                      <span
                        className="font-bold"
                        style={{
                          color: team.color,
                        }}
                      >
                        {team.remainingPoints}/{team.totalPoints}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${(team.remainingPoints / team.totalPoints) * 100}%`,
                          backgroundColor: team.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Player Count */}
                  <div className="text-xs text-gray-400">
                    {team.players.length} player{team.players.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
