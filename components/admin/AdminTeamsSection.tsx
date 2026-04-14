'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Team {
  _id: string;
  name: string;
  color: string;
  totalPoints: number;
  remainingPoints: number;
  icon?: any;
  players: any[];
}

const TEAM_COLORS = [
  { name: 'Red', value: '#ef476f' },
  { name: 'Blue', value: '#004e89' },
  { name: 'Orange', value: '#f77f00' },
  { name: 'Green', value: '#06a77d' },
  { name: 'Purple', value: '#7209b7' },
  { name: 'Yellow', value: '#ffb703' },
];

export default function AdminTeamsSection() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TEAM_COLORS[0].value);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }

    if (teams.length >= 6) {
      toast.error('You can only have 6 teams');
      return;
    }

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeamName,
          color: selectedColor,
        }),
      });

      if (response.ok) {
        toast.success('Team created successfully');
        setNewTeamName('');
        fetchTeams();
      } else {
        toast.error('Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Error creating team');
    }
  };

  if (loading) {
    return <div className="text-white">Loading teams...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Add New Team</CardTitle>
          <CardDescription>Create a new team for the auction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Team name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
            >
              {TEAM_COLORS.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.name}
                </option>
              ))}
            </select>
            <Button
              onClick={handleAddTeam}
              className="bg-primary hover:bg-primary/90"
            >
              Add Team
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card key={team._id} className="bg-slate-800 border-slate-700 overflow-hidden">
            <div
              className="h-2"
              style={{ backgroundColor: team.color }}
            />
            <CardHeader>
              <CardTitle className="text-white">{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-slate-700 rounded p-3">
                <p className="text-gray-400 text-sm">Remaining Points</p>
                <p className="text-2xl font-bold text-primary">
                  {team.remainingPoints}/{team.totalPoints}
                </p>
              </div>
              <div className="text-sm text-gray-300">
                <p>Players: {team.players.length}</p>
                {team.icon && <p className="text-primary">Icon: {team.icon.name}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-8 text-center">
            <p className="text-gray-400">No teams created yet. Add your first team above!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
