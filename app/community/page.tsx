'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { Users, TrendingUp, Target, Filter, BarChart3, Info, ChevronDown, ChevronRight, Search } from 'lucide-react';

interface UserProfile {
  belt: string;
  birthDate: string | null;
  weight: string | null;
}

interface TechniqueAverage {
  id: string;
  name: string;
  position: string;
  type: string;
  avgRating: number;
  ratedCount: number;
}

interface CommunityData {
  matchingCount: number;
  averages: {
    points: number;
    techniquesRated: number;
  };
  percentiles: {
    points: { p25: number; p50: number; p75: number; p90: number };
    techniquesRated: { p25: number; p50: number; p75: number; p90: number };
  };
  techniqueAverages: TechniqueAverage[];
  filters: {
    belt: string | null;
    ageRange: string | null;
    weight: string | null;
  };
  beltCounts: Record<string, number>;
  weightCounts: Record<string, number>;
}

interface MyStats {
  points: number;
  techniquesRated: number;
}

interface MyRatings {
  [techniqueId: string]: number;
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

const ADULT_BELTS = ['white', 'blue', 'purple', 'brown', 'black'];

const AGE_RANGES = [
  { value: 'juvenile', label: 'Juvenile (Under 18)' },
  { value: 'adult', label: 'Adult (18-29)' },
  { value: 'master1', label: 'Master 1 (30-35)' },
  { value: 'master2', label: 'Master 2 (36-40)' },
  { value: 'master3', label: 'Master 3 (41-45)' },
  { value: 'master4', label: 'Master 4 (46-50)' },
  { value: 'master5', label: 'Master 5 (51-55)' },
  { value: 'master6', label: 'Master 6 (56-60)' },
  { value: 'master7', label: 'Master 7 (61+)' },
];

const WEIGHT_CLASSES = [
  { value: 'rooster', label: 'Rooster' },
  { value: 'light-feather', label: 'Light Feather' },
  { value: 'feather', label: 'Feather' },
  { value: 'light', label: 'Light' },
  { value: 'middle', label: 'Middle' },
  { value: 'medium-heavy', label: 'Medium Heavy' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'super-heavy', label: 'Super Heavy' },
  { value: 'ultra-heavy', label: 'Ultra Heavy' },
];

function getBeltInfo(belt: string) {
  return BELT_INFO[belt] || { label: belt, color: 'bg-gray-400' };
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getAgeRangeFromBirthDate(birthDate: string): string | null {
  const age = calculateAge(birthDate);
  if (age < 18) return 'juvenile';
  if (age <= 29) return 'adult';
  if (age <= 35) return 'master1';
  if (age <= 40) return 'master2';
  if (age <= 45) return 'master3';
  if (age <= 50) return 'master4';
  if (age <= 55) return 'master5';
  if (age <= 60) return 'master6';
  return 'master7';
}

function getRatingColor(rating: number): string {
  if (rating === 0) return 'bg-gray-200 text-gray-600';
  if (rating < 2) return 'bg-white border border-gray-300 text-gray-900';
  if (rating < 3) return 'bg-blue-500 text-white';
  if (rating < 4) return 'bg-purple-500 text-white';
  if (rating < 5) return 'bg-amber-700 text-white';
  if (rating < 6) return 'bg-gray-900 text-white';
  return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900';
}

export default function CommunityPage() {
  const router = useRouter();
  const [data, setData] = useState<CommunityData | null>(null);
  const [myStats, setMyStats] = useState<MyStats | null>(null);
  const [myRatings, setMyRatings] = useState<MyRatings>({});
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Filters
  const [beltFilter, setBeltFilter] = useState<string>('');
  const [ageRangeFilter, setAgeRangeFilter] = useState<string>('');
  const [weightFilter, setWeightFilter] = useState<string>('');
  const [filtersInitialized, setFiltersInitialized] = useState(false);
  
  // Technique list state
  const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());
  const [techniqueSearch, setTechniqueSearch] = useState('');
  const [showOnlyRated, setShowOnlyRated] = useState(false);

  // Load user profile and stats
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if logged in and get profile
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setIsLoggedIn(true);
          setUserProfile({
            belt: profileData.user.belt,
            birthDate: profileData.user.birthDate,
            weight: profileData.user.weight,
          });
          
          // Get user's own stats
          const statsRes = await fetch('/api/stats');
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setMyStats({
              points: statsData.totalPoints,
              techniquesRated: statsData.totalRated,
            });
          }
          
          // Get user's ratings for comparison
          const ratingsRes = await fetch('/api/ratings');
          if (ratingsRes.ok) {
            const ratingsData = await ratingsRes.json();
            const ratingsMap: MyRatings = {};
            ratingsData.ratings.forEach((r: { techniqueId: string; rating: number }) => {
              ratingsMap[r.techniqueId] = r.rating;
            });
            setMyRatings(ratingsMap);
          }
          
          // Pre-fill filters from user profile
          if (!filtersInitialized) {
            if (profileData.user.belt) setBeltFilter(profileData.user.belt);
            if (profileData.user.birthDate) {
              const ageRange = getAgeRangeFromBirthDate(profileData.user.birthDate);
              if (ageRange) setAgeRangeFilter(ageRange);
            }
            if (profileData.user.weight) setWeightFilter(profileData.user.weight);
            setFiltersInitialized(true);
          }
        } else {
          setIsLoggedIn(false);
          setFiltersInitialized(true);
        }
      } catch (error) {
        console.error('Load user data error:', error);
        setFiltersInitialized(true);
      }
    };
    
    loadUserData();
  }, []);

  // Fetch community data when filters change
  useEffect(() => {
    if (!filtersInitialized) return;
    fetchCommunity();
  }, [beltFilter, ageRangeFilter, weightFilter, filtersInitialized]);

  const fetchCommunity = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (beltFilter) params.set('belt', beltFilter);
      if (ageRangeFilter) params.set('ageRange', ageRangeFilter);
      if (weightFilter) params.set('weight', weightFilter);
      
      const res = await fetch(`/api/community?${params}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('Fetch community error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setBeltFilter('');
    setAgeRangeFilter('');
    setWeightFilter('');
  };

  const getComparisonText = (myValue: number, average: number) => {
    if (average === 0) return { text: 'No data', color: 'text-gray-500' };
    if (myValue === average) return { text: 'At avg', color: 'text-gray-500' };
    if (myValue > average) {
      const pct = Math.round(((myValue - average) / average) * 100);
      return { text: `+${pct}%`, color: 'text-green-600 dark:text-green-400' };
    }
    const pct = Math.round(((average - myValue) / average) * 100);
    return { text: `-${pct}%`, color: 'text-orange-600 dark:text-orange-400' };
  };

  const hasActiveFilters = beltFilter || ageRangeFilter || weightFilter;

  // Group techniques by position
  const techniquesByPosition = useMemo(() => {
    if (!data?.techniqueAverages) return {};
    
    let techniques = data.techniqueAverages;
    
    // Filter by search
    if (techniqueSearch) {
      const search = techniqueSearch.toLowerCase();
      techniques = techniques.filter(t => 
        t.name.toLowerCase().includes(search) || 
        t.position.toLowerCase().includes(search)
      );
    }
    
    // Filter by rated only
    if (showOnlyRated) {
      techniques = techniques.filter(t => t.ratedCount > 0);
    }
    
    const grouped: Record<string, TechniqueAverage[]> = {};
    techniques.forEach(t => {
      if (!grouped[t.position]) grouped[t.position] = [];
      grouped[t.position].push(t);
    });
    
    return grouped;
  }, [data?.techniqueAverages, techniqueSearch, showOnlyRated]);

  const togglePosition = (position: string) => {
    setExpandedPositions(prev => {
      const next = new Set(prev);
      if (next.has(position)) {
        next.delete(position);
      } else {
        next.add(position);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedPositions(new Set(Object.keys(techniquesByPosition)));
  };

  const collapseAll = () => {
    setExpandedPositions(new Set());
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <BarChart3 className="text-blue-500" size={36} />
            Community Comparison
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            See how you compare with practitioners like you
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter by Similar Practitioners
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Belt Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Belt
              </label>
              <select
                value={beltFilter}
                onChange={(e) => setBeltFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Belts</option>
                {ADULT_BELTS.map((belt) => {
                  const info = getBeltInfo(belt);
                  const count = data?.beltCounts[belt] || 0;
                  return (
                    <option key={belt} value={belt}>
                      {info.label} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Age Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Age Division
              </label>
              <select
                value={ageRangeFilter}
                onChange={(e) => setAgeRangeFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Ages</option>
                {AGE_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight Class
              </label>
              <select
                value={weightFilter}
                onChange={(e) => setWeightFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Weight Classes</option>
                {WEIGHT_CLASSES.map((w) => {
                  const count = data?.weightCounts[w.value] || 0;
                  return (
                    <option key={w.value} value={w.value}>
                      {w.label} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {userProfile && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1">
              <Info size={14} />
              Filters are pre-filled from your profile. Adjust them to compare with different groups.
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : data ? (
          <>
            {/* Matching Count */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-8 flex items-center justify-center gap-3">
              <Users className="text-blue-600 dark:text-blue-400" size={24} />
              <p className="text-blue-800 dark:text-blue-200 text-lg">
                <span className="font-bold">{data.matchingCount}</span> practitioners match your filters
              </p>
            </div>

            {data.matchingCount === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                <Users size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  No practitioners found matching these filters
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Try adjusting your filters or clearing them to see more data
                </p>
              </div>
            ) : (
              <>
                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Points Comparison */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <TrendingUp className="text-blue-600 dark:text-blue-400" size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Total Points
                      </h3>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3">
                      <span className="text-gray-600 dark:text-gray-400">Community Avg</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {(data.averages?.points ?? 0).toLocaleString()}
                      </span>
                    </div>

                    {isLoggedIn && myStats ? (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 dark:text-blue-300">Your Points</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                              {(myStats?.points ?? 0).toLocaleString()}
                            </span>
                            <span className={`text-sm ${getComparisonText(myStats?.points ?? 0, data.averages?.points ?? 0).color}`}>
                              {getComparisonText(myStats?.points ?? 0, data.averages?.points ?? 0).text}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center">
                        <button onClick={() => router.push('/auth/login')} className="text-blue-600 hover:underline">Log in</button> to compare
                      </p>
                    )}
                  </div>

                  {/* Techniques Rated Comparison */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                        <Target className="text-green-600 dark:text-green-400" size={20} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Techniques Rated
                      </h3>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3">
                      <span className="text-gray-600 dark:text-gray-400">Community Avg</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {(data.averages?.techniquesRated ?? 0).toLocaleString()}
                      </span>
                    </div>

                    {isLoggedIn && myStats ? (
                      <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700 dark:text-green-300">Your Count</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                              {(myStats?.techniquesRated ?? 0).toLocaleString()}
                            </span>
                            <span className={`text-sm ${getComparisonText(myStats?.techniquesRated ?? 0, data.averages?.techniquesRated ?? 0).color}`}>
                              {getComparisonText(myStats?.techniquesRated ?? 0, data.averages?.techniquesRated ?? 0).text}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center">
                        <button onClick={() => router.push('/auth/login')} className="text-blue-600 hover:underline">Log in</button> to compare
                      </p>
                    )}
                  </div>
                </div>

                {/* Technique List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Technique Breakdown
                    </h3>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Search */}
                      <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={techniqueSearch}
                          onChange={(e) => setTechniqueSearch(e.target.value)}
                          placeholder="Search techniques..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      {/* Toggle rated only */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showOnlyRated}
                          onChange={(e) => setShowOnlyRated(e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Only with ratings</span>
                      </label>
                      
                      {/* Expand/Collapse buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={expandAll}
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Expand All
                        </button>
                        <button
                          onClick={collapseAll}
                          className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          Collapse All
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Object.keys(techniquesByPosition).sort().map(position => {
                      const techniques = techniquesByPosition[position];
                      const isExpanded = expandedPositions.has(position);
                      const ratedTechniques = techniques.filter(t => t.ratedCount > 0);
                      const positionAvg = ratedTechniques.length > 0 
                        ? ratedTechniques.reduce((sum, t) => sum + t.avgRating, 0) / ratedTechniques.length
                        : 0;
                      
                      return (
                        <div key={position}>
                          <button
                            onClick={() => togglePosition(position)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            <div className="flex items-center gap-3">
                              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                              <span className="font-medium text-gray-900 dark:text-white">{position}</span>
                              <span className="text-sm text-gray-500">({techniques.length} techniques)</span>
                            </div>
                            {positionAvg > 0 && (
                              <span className={`px-2 py-1 rounded text-sm font-medium ${getRatingColor(positionAvg)}`}>
                                Avg: {positionAvg.toFixed(1)}
                              </span>
                            )}
                          </button>
                          
                          {isExpanded && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                    <th className="px-4 py-2 text-left">Technique</th>
                                    <th className="px-4 py-2 text-center w-24">Community Avg</th>
                                    <th className="px-4 py-2 text-center w-20"># Rated</th>
                                    {isLoggedIn && <th className="px-4 py-2 text-center w-20">You</th>}
                                    {isLoggedIn && <th className="px-4 py-2 text-center w-20">Diff</th>}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  {techniques.map(tech => {
                                    const myRating = myRatings[tech.id] || 0;
                                    const diff = myRating - tech.avgRating;
                                    
                                    return (
                                      <tr key={tech.id} className="hover:bg-gray-100 dark:hover:bg-gray-800/50">
                                        <td className="px-4 py-2">
                                          <span className="text-gray-900 dark:text-white">{tech.name}</span>
                                          <span className="text-xs text-gray-500 ml-2">{tech.type}</span>
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                          {tech.ratedCount > 0 ? (
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRatingColor(tech.avgRating)}`}>
                                              {tech.avgRating.toFixed(1)}
                                            </span>
                                          ) : (
                                            <span className="text-gray-400">—</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-2 text-center text-sm text-gray-500">
                                          {tech.ratedCount}
                                        </td>
                                        {isLoggedIn && (
                                          <td className="px-4 py-2 text-center">
                                            {myRating > 0 ? (
                                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getRatingColor(myRating)}`}>
                                                {myRating}
                                              </span>
                                            ) : (
                                              <span className="text-gray-400">—</span>
                                            )}
                                          </td>
                                        )}
                                        {isLoggedIn && (
                                          <td className="px-4 py-2 text-center">
                                            {myRating > 0 && tech.ratedCount > 0 ? (
                                              <span className={`text-sm font-medium ${
                                                diff > 0 ? 'text-green-600 dark:text-green-400' :
                                                diff < 0 ? 'text-orange-600 dark:text-orange-400' :
                                                'text-gray-500'
                                              }`}>
                                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                                              </span>
                                            ) : (
                                              <span className="text-gray-400">—</span>
                                            )}
                                          </td>
                                        )}
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </>
        ) : null}

        {/* Footer note */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Statistics are calculated from all users anonymously.
          <br />
          <button
            onClick={() => router.push('/profile')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Update your profile
          </button>
          {' '}to set your belt, age, and weight for better comparisons.
        </p>
      </main>
    </div>
  );
}
