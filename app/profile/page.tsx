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

interface ScorePoint {
  date: string;
  score: number;
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

// Simple SVG Line Chart component
function ScoreChart({ data }: { data: ScorePoint[] }) {
  if (data.length < 2) return null;

  const width = 600;
  const height = 200;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const scores = data.map(d => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const scoreRange = maxScore - minScore || 1;

  const dates = data.map(d => new Date(d.date).getTime());
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const dateRange = maxDate - minDate || 1;

  const getX = (date: string) => {
    const t = new Date(date).getTime();
    return padding.left + ((t - minDate) / dateRange) * chartWidth;
  };

  const getY = (score: number) => {
    return padding.top + chartHeight - ((score - minScore) / scoreRange) * chartHeight;
  };

  // Create path
  const pathD = data.map((point, i) => {
    const x = getX(point.date);
    const y = getY(point.score);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create area fill path
  const areaD = pathD + ` L ${getX(data[data.length - 1].date)} ${padding.top + chartHeight} L ${getX(data[0].date)} ${padding.top + chartHeight} Z`;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Y-axis labels
  const yLabels = [minScore, Math.round((minScore + maxScore) / 2), maxScore];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* Grid lines */}
      {yLabels.map(score => (
        <g key={score}>
          <line
            x1={padding.left}
            y1={getY(score)}
            x2={width - padding.right}
            y2={getY(score)}
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeDasharray="4 4"
          />
          <text
            x={padding.left - 8}
            y={getY(score)}
            textAnchor="end"
            alignmentBaseline="middle"
            className="fill-gray-500 text-xs"
          >
            {score}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path
        d={areaD}
        fill="url(#gradient)"
        opacity={0.3}
      />

      {/* Line */}
      <path
        d={pathD}
        fill="none"
        stroke="#3B82F6"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {data.map((point, i) => (
        <circle
          key={i}
          cx={getX(point.date)}
          cy={getY(point.score)}
          r={3}
          fill="#3B82F6"
        />
      ))}

      {/* X-axis labels (first and last) */}
      <text
        x={getX(data[0].date)}
        y={height - 10}
        textAnchor="start"
        className="fill-gray-500 text-xs"
      >
        {formatDate(data[0].date)}
      </text>
      <text
        x={getX(data[data.length - 1].date)}
        y={height - 10}
        textAnchor="end"
        className="fill-gray-500 text-xs"
      >
        {formatDate(data[data.length - 1].date)}
      </text>

      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScorePoint[]>([]);
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
      fetchScoreHistory();
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

  const fetchScoreHistory = async () => {
    try {
      const res = await fetch('/api/stats/history');
      if (res.ok) {
        const data = await res.json();
        setScoreHistory(data.timeline);
      }
    } catch (error) {
      console.error('Fetch score history error:', error);
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
                {/* Score History Chart */}
                {scoreHistory.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Score History
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <ScoreChart data={scoreHistory} />
                    </div>
                  </div>
                )}

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
