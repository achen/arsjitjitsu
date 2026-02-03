'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Trophy, Users, Medal, MapPin, Building2 } from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  name: string;
  belt: string;
  country: string | null;
  city: string | null;
  gym: string | null;
  score: number;
  techniquesRated: number;
  rank: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  totalUsers: number;
  totalPublicUsers: number;
  beltCounts: Record<string, number>;
  filteredBy: string | null;
}

// Belt display info
const BELT_INFO: Record<string, { label: string; color: string }> = {
  'white-grey': { label: 'White-Grey', color: 'bg-gradient-to-r from-white to-gray-400 border border-gray-300' },
  'grey': { label: 'Grey', color: 'bg-gray-400' },
  'grey-white': { label: 'Grey-White', color: 'bg-gradient-to-r from-gray-400 to-white border border-gray-300' },
  'grey-black': { label: 'Grey-Black', color: 'bg-gradient-to-r from-gray-400 to-gray-900' },
  'yellow': { label: 'Yellow', color: 'bg-yellow-400' },
  'yellow-white': { label: 'Yellow-White', color: 'bg-gradient-to-r from-yellow-400 to-white border border-gray-300' },
  'yellow-black': { label: 'Yellow-Black', color: 'bg-gradient-to-r from-yellow-400 to-gray-900' },
  'orange': { label: 'Orange', color: 'bg-orange-500' },
  'orange-white': { label: 'Orange-White', color: 'bg-gradient-to-r from-orange-500 to-white border border-gray-300' },
  'orange-black': { label: 'Orange-Black', color: 'bg-gradient-to-r from-orange-500 to-gray-900' },
  'green': { label: 'Green', color: 'bg-green-500' },
  'green-white': { label: 'Green-White', color: 'bg-gradient-to-r from-green-500 to-white border border-gray-300' },
  'green-black': { label: 'Green-Black', color: 'bg-gradient-to-r from-green-500 to-gray-900' },
  'white': { label: 'White', color: 'bg-white border-2 border-gray-300' },
  'blue': { label: 'Blue', color: 'bg-blue-600' },
  'purple': { label: 'Purple', color: 'bg-purple-600' },
  'brown': { label: 'Brown', color: 'bg-amber-700' },
  'black': { label: 'Black', color: 'bg-black' },
  'coral': { label: 'Coral', color: 'bg-gradient-to-r from-black via-red-600 to-black' },
  'red-white': { label: 'Red-White', color: 'bg-gradient-to-r from-red-600 via-white to-red-600 border border-gray-300' },
  'red': { label: 'Red', color: 'bg-red-600' },
};

// Common adult belts for filter buttons
const FILTER_BELTS = ['white', 'blue', 'purple', 'brown', 'black'];

function getBeltInfo(belt: string) {
  return BELT_INFO[belt] || { label: belt, color: 'bg-gray-400' };
}

function getRankBadge(rank: number) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [beltFilter, setBeltFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [beltFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (beltFilter) params.set('belt', beltFilter);
      
      const res = await fetch(`/api/leaderboard?${params}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Fetch leaderboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" size={36} />
            Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            See how you stack up against other practitioners
          </p>
        </div>

        {/* Stats Cards */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Medal className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">On Leaderboard</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.totalPublicUsers.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Trophy className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {beltFilter ? `${getBeltInfo(beltFilter).label} Belt Leaders` : 'Top Score'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.leaderboard[0]?.score.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Belt Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
              Filter by Belt:
            </span>
            <button
              onClick={() => setBeltFilter(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                beltFilter === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All Belts
            </button>
            {FILTER_BELTS.map((belt) => {
              const info = getBeltInfo(belt);
              const count = data?.beltCounts[belt] || 0;
              return (
                <button
                  key={belt}
                  onClick={() => setBeltFilter(belt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    beltFilter === belt
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${info.color}`}></div>
                  {info.label}
                  {count > 0 && (
                    <span className="text-xs opacity-70">({count})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : data?.leaderboard.length === 0 ? (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <Trophy size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No users on the leaderboard yet</p>
              <p className="text-sm mt-2">Be the first to rate techniques and appear here!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Belt
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Gym
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                      Rated
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data?.leaderboard.map((entry) => {
                    const beltInfo = getBeltInfo(entry.belt);
                    return (
                      <tr
                        key={entry.id}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                          entry.rank <= 3 ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-lg font-bold ${
                            entry.rank === 1 ? 'text-yellow-500' :
                            entry.rank === 2 ? 'text-gray-400' :
                            entry.rank === 3 ? 'text-amber-600' :
                            'text-gray-500 dark:text-gray-400'
                          }`}>
                            {getRankBadge(entry.rank)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${beltInfo.color} flex items-center justify-center flex-shrink-0`}>
                              <span className="text-sm">🥋</span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {entry.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {beltInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          {(entry.city || entry.country) ? (
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <MapPin size={14} />
                              {[entry.city, entry.country].filter(Boolean).join(', ')}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          {entry.gym ? (
                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Building2 size={14} />
                              {entry.gym}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {entry.score.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right hidden sm:table-cell">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {entry.techniquesRated}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Only users who have opted to appear on the leaderboard are shown.
          Update your profile privacy settings to be included.
        </p>
      </main>
    </div>
  );
}
