'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Trophy, Target, TrendingUp, Clock, Edit2, MapPin, Building2, Calendar, Globe, User as UserIcon, X, Check, Plus, Trash2 } from 'lucide-react';

interface BeltHistoryEntry {
  id: string;
  belt: string;
  achievedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  belt: string;
  isPublic: boolean;
  birthDate: string | null;
  country: string | null;
  city: string | null;
  gym: string | null;
  createdAt: string;
  beltHistory: BeltHistoryEntry[];
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

// All belts - kids and adults
const KIDS_BELTS = [
  { value: 'white-grey', label: 'White-Grey', color: 'bg-gradient-to-r from-white to-gray-400 border border-gray-300' },
  { value: 'grey', label: 'Grey', color: 'bg-gray-400' },
  { value: 'grey-white', label: 'Grey-White', color: 'bg-gradient-to-r from-gray-400 to-white border border-gray-300' },
  { value: 'grey-black', label: 'Grey-Black', color: 'bg-gradient-to-r from-gray-400 to-gray-900' },
  { value: 'yellow', label: 'Yellow', color: 'bg-yellow-400' },
  { value: 'yellow-white', label: 'Yellow-White', color: 'bg-gradient-to-r from-yellow-400 to-white border border-gray-300' },
  { value: 'yellow-black', label: 'Yellow-Black', color: 'bg-gradient-to-r from-yellow-400 to-gray-900' },
  { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
  { value: 'orange-white', label: 'Orange-White', color: 'bg-gradient-to-r from-orange-500 to-white border border-gray-300' },
  { value: 'orange-black', label: 'Orange-Black', color: 'bg-gradient-to-r from-orange-500 to-gray-900' },
  { value: 'green', label: 'Green', color: 'bg-green-500' },
  { value: 'green-white', label: 'Green-White', color: 'bg-gradient-to-r from-green-500 to-white border border-gray-300' },
  { value: 'green-black', label: 'Green-Black', color: 'bg-gradient-to-r from-green-500 to-gray-900' },
];

const ADULT_BELTS = [
  { value: 'white', label: 'White', color: 'bg-white border-2 border-gray-300' },
  { value: 'blue', label: 'Blue', color: 'bg-blue-600' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-600' },
  { value: 'brown', label: 'Brown', color: 'bg-amber-700' },
  { value: 'black', label: 'Black', color: 'bg-black' },
  { value: 'coral', label: 'Coral (7th Degree)', color: 'bg-gradient-to-r from-black via-red-600 to-black' },
  { value: 'red-white', label: 'Red-White (8th Degree)', color: 'bg-gradient-to-r from-red-600 via-white to-red-600 border border-gray-300' },
  { value: 'red', label: 'Red (9th/10th Degree)', color: 'bg-red-600' },
];

const ALL_BELTS = [...KIDS_BELTS, ...ADULT_BELTS];

function getBeltInfo(belt: string) {
  return ALL_BELTS.find(b => b.value === belt) || { value: belt, label: belt, color: 'bg-gray-400' };
}

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

  const pathD = data.map((point, i) => {
    const x = getX(point.date);
    const y = getY(point.score);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaD = pathD + ` L ${getX(data[data.length - 1].date)} ${padding.top + chartHeight} L ${getX(data[0].date)} ${padding.top + chartHeight} Z`;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const yLabels = [minScore, Math.round((minScore + maxScore) / 2), maxScore];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
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
      <path d={areaD} fill="url(#gradient)" opacity={0.3} />
      <path d={pathD} fill="none" stroke="#3B82F6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {data.map((point, i) => (
        <circle key={i} cx={getX(point.date)} cy={getY(point.score)} r={3} fill="#3B82F6" />
      ))}
      <text x={getX(data[0].date)} y={height - 10} textAnchor="start" className="fill-gray-500 text-xs">
        {formatDate(data[0].date)}
      </text>
      <text x={getX(data[data.length - 1].date)} y={height - 10} textAnchor="end" className="fill-gray-500 text-xs">
        {formatDate(data[data.length - 1].date)}
      </text>
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
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [scoreHistory, setScoreHistory] = useState<ScorePoint[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check for tab query param to open edit profile directly
  const initialTab = searchParams.get('tab') === 'edit' ? 'profile' : 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'types' | 'profile'>(initialTab);
  
  // Edit profile state
  const [profileForm, setProfileForm] = useState({
    name: '',
    belt: '',
    isPublic: true,
    birthDate: '',
    country: '',
    city: '',
    gym: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Belt picker modal
  const [showBeltPicker, setShowBeltPicker] = useState(false);
  
  // Belt history state
  const [beltHistory, setBeltHistory] = useState<BeltHistoryEntry[]>([]);
  const [addingBeltHistory, setAddingBeltHistory] = useState(false);
  const [newBeltEntry, setNewBeltEntry] = useState({ belt: '', achievedAt: '' });
  const [savingBeltHistory, setSavingBeltHistory] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/profile');
      if (!res.ok) {
        router.push('/auth/login');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setBeltHistory(data.user.beltHistory || []);
      setProfileForm({
        name: data.user.name,
        belt: data.user.belt,
        isPublic: data.user.isPublic,
        birthDate: data.user.birthDate ? data.user.birthDate.split('T')[0] : '',
        country: data.user.country || '',
        city: data.user.city || '',
        gym: data.user.gym || '',
      });
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

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(prev => prev ? { ...prev, ...data.user, beltHistory: prev.beltHistory } : null);
      }
    } catch (error) {
      console.error('Save profile error:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleBeltSelect = async (belt: string) => {
    setProfileForm(prev => ({ ...prev, belt }));
    setShowBeltPicker(false);
    
    // Save immediately
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ belt }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(prev => prev ? { ...prev, ...data.user, beltHistory: prev.beltHistory } : null);
      }
    } catch (error) {
      console.error('Save belt error:', error);
    }
  };

  const addBeltHistoryEntry = async () => {
    if (!newBeltEntry.belt || !newBeltEntry.achievedAt) return;
    
    setSavingBeltHistory(true);
    try {
      const res = await fetch('/api/belt-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBeltEntry),
      });
      if (res.ok) {
        const data = await res.json();
        setBeltHistory(prev => [...prev, data.entry].sort((a, b) => 
          new Date(a.achievedAt).getTime() - new Date(b.achievedAt).getTime()
        ));
        setNewBeltEntry({ belt: '', achievedAt: '' });
        setAddingBeltHistory(false);
      }
    } catch (error) {
      console.error('Add belt history error:', error);
    } finally {
      setSavingBeltHistory(false);
    }
  };

  const deleteBeltHistoryEntry = async (entryId: string) => {
    if (!confirm('Remove this belt from your history?')) return;
    
    try {
      const res = await fetch(`/api/belt-history?id=${entryId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBeltHistory(prev => prev.filter(e => e.id !== entryId));
      }
    } catch (error) {
      console.error('Delete belt history error:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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

  const beltInfo = getBeltInfo(user.belt);
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBeltPicker(true)}
                className={`w-16 h-16 rounded-full ${beltInfo.color} flex items-center justify-center cursor-pointer hover:ring-4 hover:ring-blue-300 transition-all`}
                title="Click to change belt"
              >
                <span className="text-2xl">🥋</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <button
                  onClick={() => setShowBeltPicker(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {beltInfo.label} Belt ✏️
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {user.gym && (
                <span className="flex items-center gap-1">
                  <Building2 size={14} /> {user.gym}
                </span>
              )}
              {(user.city || user.country) && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {[user.city, user.country].filter(Boolean).join(', ')}
                </span>
              )}
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
            <nav className="flex overflow-x-auto">
              {(['overview', 'positions', 'types', 'profile'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab === 'profile' ? 'Edit Profile' : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
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
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                            {rating.rating}: {RATING_LABELS[rating.rating]}
                          </span>
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

            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <UserIcon size={20} /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={profileForm.birthDate}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, birthDate: e.target.value }))}
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {profileForm.birthDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Age: {calculateAge(profileForm.birthDate)} years old
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Location & Gym */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin size={20} /> Location & Gym
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={profileForm.country}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="e.g. United States"
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="e.g. Los Angeles"
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Gym / Academy
                      </label>
                      <input
                        type="text"
                        value={profileForm.gym}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, gym: e.target.value }))}
                        placeholder="e.g. Gracie Barra"
                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe size={20} /> Privacy
                  </h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profileForm.isPublic}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 dark:border-gray-600"
                    />
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">Show on Leaderboard</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow your name and score to appear on the public leaderboard
                      </p>
                    </div>
                  </label>
                </div>

                {/* Belt History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar size={20} /> Belt History
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Track when you received each belt to see how your progress correlates with promotions.
                  </p>
                  
                  {beltHistory.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {beltHistory.map((entry) => {
                        const entryBeltInfo = getBeltInfo(entry.belt);
                        return (
                          <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full ${entryBeltInfo.color}`}></div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {entryBeltInfo.label} Belt
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(entry.achievedAt)}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteBeltHistoryEntry(entry.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {addingBeltHistory ? (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Belt
                          </label>
                          <select
                            value={newBeltEntry.belt}
                            onChange={(e) => setNewBeltEntry(prev => ({ ...prev, belt: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          >
                            <option value="">Select belt...</option>
                            <optgroup label="Kids Belts">
                              {KIDS_BELTS.map(b => (
                                <option key={b.value} value={b.value}>{b.label}</option>
                              ))}
                            </optgroup>
                            <optgroup label="Adult Belts">
                              {ADULT_BELTS.map(b => (
                                <option key={b.value} value={b.value}>{b.label}</option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date Received
                          </label>
                          <input
                            type="date"
                            value={newBeltEntry.achievedAt}
                            onChange={(e) => setNewBeltEntry(prev => ({ ...prev, achievedAt: e.target.value }))}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={addBeltHistoryEntry}
                          disabled={savingBeltHistory || !newBeltEntry.belt || !newBeltEntry.achievedAt}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          <Check size={16} /> Save
                        </button>
                        <button
                          onClick={() => {
                            setAddingBeltHistory(false);
                            setNewBeltEntry({ belt: '', achievedAt: '' });
                          }}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingBeltHistory(true)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500"
                    >
                      <Plus size={16} /> Add Belt Promotion
                    </button>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={saveProfile}
                    disabled={savingProfile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {savingProfile ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Check size={16} /> Save Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Belt Picker Modal */}
      {showBeltPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Select Your Belt</h2>
              <button
                onClick={() => setShowBeltPicker(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Kids Belts (Under 16)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {KIDS_BELTS.map((belt) => (
                  <button
                    key={belt.value}
                    onClick={() => handleBeltSelect(belt.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      user.belt === belt.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${belt.color} flex-shrink-0`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {belt.label}
                    </span>
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Adult Belts
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ADULT_BELTS.map((belt) => (
                  <button
                    key={belt.value}
                    onClick={() => handleBeltSelect(belt.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                      user.belt === belt.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full ${belt.color} flex-shrink-0`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {belt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
