'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Trophy, Target, TrendingUp, Clock } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  belt: string;
}

interface PositionStats {
  position: string;
  total_count: number;
  rated_count: number;
  total_points: number;
  avg_rating: number | null;
}

interface TypeStats {
  type: string;
  total_count: number;
  rated_count: number;
  total_points: number;
  avg_rating: number | null;
}

interface RecentRating {
  id: string;
  technique_name: string;
  position: string;
  type: string;
  rating: number;
  updated_at: string;
}

interface Stats {
  totalScore: number;
  ratedTechniques: number;
  totalTechniques: number;
  byPosition: PositionStats[];
  byType: TypeStats[];
  recentRatings: RecentRating[];
}

const RATING_LABELS = [
  "Don't know",
  "White",
  "Blue",
  "Purple",
  "Brown",
  "Black",
  "Comp BB",
  "World"
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'types'>('overview');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      fetchStats();
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth/login');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBeltColor = (belt: string) => {
    const colors: Record<string, string> = {
      white: 'bg-white border-2 border-gray-300',
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      brown: 'bg-amber-700',
      black: 'bg-black',
    };
    return colors[belt] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    return null;
  }

  const completionPercent = stats.totalTechniques > 0 
    ? Math.round((stats.ratedTechniques / stats.totalTechniques) * 100) 
    : 0;

  const maxPossibleScore = stats.totalTechniques * 7;
  const scorePercent = maxPossibleScore > 0 
    ? Math.round((stats.totalScore / maxPossibleScore) * 100) 
    : 0;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${getBeltColor(user.belt)} flex items-center justify-center`}>
              <span className="text-2xl">🥋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 capitalize">
                {user.belt} Belt
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Trophy className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalScore.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Techniques Rated</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.ratedTechniques} / {stats.totalTechniques}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completion</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completionPercent}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Clock className="text-orange-600 dark:text-orange-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.ratedTechniques > 0 
                    ? (stats.totalScore / stats.ratedTechniques).toFixed(1)
                    : '0'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex">
              {(['overview', 'positions', 'types'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Score Progress */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Score Progress
                  </h3>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {stats.totalScore.toLocaleString()} / {maxPossibleScore.toLocaleString()} possible points ({scorePercent}%)
                  </p>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  {stats.recentRatings.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">
                      No ratings yet. Start rating techniques to track your progress!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {stats.recentRatings.map((rating) => (
                        <div
                          key={rating.id}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {rating.technique_name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {rating.position} • {rating.type}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                              {rating.rating}: {RATING_LABELS[rating.rating]}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'positions' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Progress by Position
                </h3>
                <div className="space-y-3">
                  {stats.byPosition.map((pos) => (
                    <div key={pos.position} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {pos.position}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {pos.rated_count}/{pos.total_count} rated • {pos.total_points} pts
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${pos.total_count > 0 ? (pos.rated_count / pos.total_count) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'types' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Progress by Technique Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stats.byType.map((type) => (
                    <div key={type.type} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {type.type}
                        </span>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {type.total_points}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {type.rated_count}/{type.total_count} techniques rated
                        {type.avg_rating !== null && ` • Avg: ${type.avg_rating}`}
                      </p>
                      <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${type.total_count > 0 ? (type.rated_count / type.total_count) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
