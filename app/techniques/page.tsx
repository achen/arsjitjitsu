'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Search, Filter, ChevronDown, ChevronUp, Star } from 'lucide-react';

interface Technique {
  id: string;
  name: string;
  position: string;
  type: string;
  description: string | null;
  rating: number | null;
  notes: string | null;
}

interface User {
  id: string;
  name: string;
}

const POSITIONS = [
  'Mount Top', 'Mount Bottom', 'Side Control Top', 'Side Control Bottom',
  'Back Control', 'Back Defense', 'Closed Guard Top', 'Closed Guard Bottom',
  'Half Guard Top', 'Half Guard Bottom', 'Butterfly Guard', 'De La Riva Guard',
  'Reverse De La Riva', 'Spider Guard', 'Lasso Guard', 'X-Guard', 'Single Leg X',
  '50/50', 'Knee Shield', 'Z-Guard', 'Rubber Guard', 'Worm Guard', 'Standing',
  'Turtle Top', 'Turtle Bottom', 'North-South Top', 'North-South Bottom',
  'Knee on Belly', 'Crucifix', 'Leg Entanglement'
];

const TYPES = [
  'Escape', 'Sweep', 'Reversal', 'Takedown', 'Submission', 'Pass', 'Transition', 'Setup', 'Defense'
];

const RATING_LABELS = [
  "Don't know it",
  "White belts",
  "Blue belts",
  "Purple belts",
  "Brown belts",
  "Black belts",
  "Competition BBs",
  "World class"
];

export default function TechniquesPage() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedTechnique, setExpandedTechnique] = useState<string | null>(null);
  const [savingRating, setSavingRating] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    fetchTechniques();
  }, [selectedPosition, selectedType, searchQuery]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  };

  const fetchTechniques = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedPosition) params.set('position', selectedPosition);
      if (selectedType) params.set('type', selectedType);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/techniques?${params}`);
      const data = await res.json();
      setTechniques(data.techniques || []);
    } catch (error) {
      console.error('Fetch techniques error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveRating = async (techniqueId: string, rating: number) => {
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }

    setSavingRating(techniqueId);
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techniqueId, rating }),
      });

      if (res.ok) {
        setTechniques(techniques.map(t => 
          t.id === techniqueId ? { ...t, rating } : t
        ));
      }
    } catch (error) {
      console.error('Save rating error:', error);
    } finally {
      setSavingRating(null);
    }
  };

  const getRatingColor = (rating: number | null) => {
    if (rating === null || rating === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (rating === 1) return 'bg-white border-2 border-gray-400';
    if (rating === 2) return 'bg-blue-500';
    if (rating === 3) return 'bg-purple-500';
    if (rating === 4) return 'bg-amber-700';
    if (rating >= 5) return 'bg-gray-900';
    return 'bg-gray-200';
  };

  const groupedTechniques = techniques.reduce((acc, technique) => {
    if (!acc[technique.position]) {
      acc[technique.position] = [];
    }
    acc[technique.position].push(technique);
    return acc;
  }, {} as Record<string, Technique[]>);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Techniques
          </h1>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search techniques..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Filter size={20} />
                <span>Filters</span>
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Position
                  </label>
                  <select
                    value={selectedPosition}
                    onChange={(e) => setSelectedPosition(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Positions</option>
                    {POSITIONS.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Types</option>
                    {TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedPosition('');
                      setSelectedType('');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading techniques...</p>
          </div>
        ) : techniques.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
            <p className="text-gray-600 dark:text-gray-400">No techniques found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTechniques).map(([position, techs]) => (
              <div key={position} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {position} <span className="text-gray-500">({techs.length})</span>
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {techs.map((technique) => (
                    <div key={technique.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              technique.type === 'Submission' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              technique.type === 'Sweep' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              technique.type === 'Escape' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              technique.type === 'Pass' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                              technique.type === 'Takedown' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                            }`}>
                              {technique.type}
                            </span>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {technique.name}
                            </h3>
                          </div>
                          {technique.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {technique.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setExpandedTechnique(
                            expandedTechnique === technique.id ? null : technique.id
                          )}
                          className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRatingColor(technique.rating)} ${
                            technique.rating && technique.rating > 0 && technique.rating < 5 ? 'text-white' : ''
                          }`}
                        >
                          {technique.rating ?? 0}
                        </button>
                      </div>

                      {/* Expanded Rating Selector */}
                      {expandedTechnique === technique.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {user ? 'Rate your proficiency:' : 'Login to rate this technique'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {RATING_LABELS.map((label, index) => (
                              <button
                                key={index}
                                onClick={() => saveRating(technique.id, index)}
                                disabled={savingRating === technique.id || !user}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                  technique.rating === index
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                {index}: {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
