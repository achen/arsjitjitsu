'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Search, Filter, ChevronDown, ChevronUp, CheckSquare, Square, X, Star, Play, ExternalLink, MessageSquare, Plus, Trash2 } from 'lucide-react';

interface TechniqueVideo {
  id: string;
  title: string;
  url: string;
  instructor: string | null;
  duration: string | null;
}

interface TechniqueNote {
  id: string;
  content: string;
  createdAt: string;
}

interface Technique {
  id: string;
  name: string;
  position: string;
  type: string;
  description: string | null;
  rating: number | null;
  notes: string | null;
  workingOn: boolean;
  videos: TechniqueVideo[];
}

interface User {
  id: string;
  name: string;
}

const POSITIONS = [
  'Mount Top', 'Mount Bottom', 'Side Control Top', 'Side Control Bottom',
  'Back Control', 'Back Defense', 'Closed Guard Top', 'Closed Guard Bottom',
  'Half Guard Top', 'Half Guard Bottom', 'Butterfly Guard', 'Butterfly Half',
  'De La Riva Guard', 'Reverse De La Riva', 'Spider Guard', 'Lasso Guard', 'X-Guard', 'Single Leg X',
  '50/50', 'Knee Shield', 'Z-Guard', 'Lockdown', 'Octopus Guard', 'High Ground', 'K Guard',
  'Rubber Guard', 'Worm Guard', 'Waiter Guard', 'Standing',
  'Turtle Top', 'Turtle Bottom', 'North-South Top', 'North-South Bottom',
  'Knee on Belly', 'Crucifix', 'Leg Entanglement'
];

const TYPES = [
  'Escape', 'Sweep', 'Reversal', 'Takedown', 'Submission', 'Pass', 'Transition', 'Setup', 'Defense'
];

const RATING_OPTIONS = [
  { value: 0, label: "Don't know it" },
  { value: 1, label: "White belt" },
  { value: 2, label: "Blue belt" },
  { value: 3, label: "Purple belt" },
  { value: 4, label: "Brown belt" },
  { value: 5, label: "Black belt" },
  { value: 6, label: "Competition black belt" },
  { value: 7, label: "World class black belt" },
];

export default function TechniquesPage() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [savingRating, setSavingRating] = useState<string | null>(null);
  
  // Multi-select state
  const [selectedTechniques, setSelectedTechniques] = useState<Set<string>>(new Set());
  const [bulkRating, setBulkRating] = useState<number | ''>('');
  const [savingBulk, setSavingBulk] = useState(false);
  
  // Collapsed groups state (stored in localStorage)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [showWorkingOnOnly, setShowWorkingOnOnly] = useState(false);
  
  // Expanded videos state
  const [expandedVideos, setExpandedVideos] = useState<Set<string>>(new Set());
  
  // Notes state
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [techniqueNotes, setTechniqueNotes] = useState<Record<string, TechniqueNote[]>>({});
  const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set());
  const [newNoteText, setNewNoteText] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);

  // Load collapsed groups from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('collapsedGroups');
    if (saved) {
      setCollapsedGroups(new Set(JSON.parse(saved)));
    } else {
      // All collapsed by default - will be set after techniques load
    }
  }, []);

  // Set all groups collapsed by default when techniques first load
  useEffect(() => {
    if (techniques.length > 0 && !localStorage.getItem('collapsedGroups')) {
      const allPositions = new Set(techniques.map(t => t.position));
      setCollapsedGroups(allPositions);
      localStorage.setItem('collapsedGroups', JSON.stringify([...allPositions]));
    }
  }, [techniques]);

  const toggleGroupCollapse = (position: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(position)) {
      newCollapsed.delete(position);
    } else {
      newCollapsed.add(position);
    }
    setCollapsedGroups(newCollapsed);
    localStorage.setItem('collapsedGroups', JSON.stringify([...newCollapsed]));
  };

  const expandAll = () => {
    setCollapsedGroups(new Set());
    localStorage.setItem('collapsedGroups', JSON.stringify([]));
  };

  const collapseAll = () => {
    const allPositions = new Set(techniques.map(t => t.position));
    setCollapsedGroups(allPositions);
    localStorage.setItem('collapsedGroups', JSON.stringify([...allPositions]));
  };

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
      setSelectedTechniques(new Set()); // Clear selection when filters change
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

  const saveBulkRatings = async () => {
    if (!user || bulkRating === '' || selectedTechniques.size === 0) return;

    const ratingValue = typeof bulkRating === 'string' ? parseInt(bulkRating, 10) : bulkRating;
    const selectedIdsArray = Array.from(selectedTechniques);
    
    setSavingBulk(true);
    try {
      const res = await fetch('/api/ratings/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          techniqueIds: selectedIdsArray, 
          rating: ratingValue 
        }),
      });

      if (res.ok) {
        // Update techniques with the new rating using the saved array
        setTechniques(prev => prev.map(t => 
          selectedIdsArray.includes(t.id) ? { ...t, rating: ratingValue } : t
        ));
        setSelectedTechniques(new Set());
        setBulkRating('');
      } else {
        const errorText = await res.text();
        console.error('Bulk save failed:', errorText);
        alert(`Failed to save: ${errorText}`);
      }
    } catch (error) {
      console.error('Bulk save error:', error);
      alert(`Error: ${error}`);
    } finally {
      setSavingBulk(false);
    }
  };

  const toggleTechniqueSelection = (id: string) => {
    const newSelection = new Set(selectedTechniques);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedTechniques(newSelection);
  };

  const selectAllInPosition = (position: string) => {
    const techsInPosition = techniques.filter(t => t.position === position);
    const allSelected = techsInPosition.every(t => selectedTechniques.has(t.id));
    
    const newSelection = new Set(selectedTechniques);
    if (allSelected) {
      techsInPosition.forEach(t => newSelection.delete(t.id));
    } else {
      techsInPosition.forEach(t => newSelection.add(t.id));
    }
    setSelectedTechniques(newSelection);
  };

  const selectAll = () => {
    if (selectedTechniques.size === techniques.length) {
      setSelectedTechniques(new Set());
    } else {
      setSelectedTechniques(new Set(techniques.map(t => t.id)));
    }
  };

  const toggleWorkingOn = async (techniqueId: string, currentValue: boolean) => {
    if (!user) return;

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techniqueId, workingOn: !currentValue }),
      });

      if (res.ok) {
        setTechniques(prev => prev.map(t => 
          t.id === techniqueId ? { ...t, workingOn: !currentValue } : t
        ));
      }
    } catch (error) {
      console.error('Toggle working on error:', error);
    }
  };

  const toggleNotesExpanded = async (techniqueId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(techniqueId)) {
      newExpanded.delete(techniqueId);
    } else {
      newExpanded.add(techniqueId);
      // Fetch notes if not already loaded
      if (!techniqueNotes[techniqueId]) {
        await fetchNotes(techniqueId);
      }
    }
    setExpandedNotes(newExpanded);
  };

  const fetchNotes = async (techniqueId: string) => {
    setLoadingNotes(prev => new Set(prev).add(techniqueId));
    try {
      const res = await fetch(`/api/notes?techniqueId=${techniqueId}`);
      if (res.ok) {
        const data = await res.json();
        setTechniqueNotes(prev => ({ ...prev, [techniqueId]: data.notes }));
      }
    } catch (error) {
      console.error('Fetch notes error:', error);
    } finally {
      setLoadingNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(techniqueId);
        return newSet;
      });
    }
  };

  const addNote = async (techniqueId: string) => {
    if (!user) return;
    const content = newNoteText[techniqueId]?.trim();
    if (!content) return;

    setSavingNote(techniqueId);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ techniqueId, content }),
      });

      if (res.ok) {
        const data = await res.json();
        setTechniqueNotes(prev => ({
          ...prev,
          [techniqueId]: [data.note, ...(prev[techniqueId] || [])],
        }));
        setNewNoteText(prev => ({ ...prev, [techniqueId]: '' }));
      }
    } catch (error) {
      console.error('Add note error:', error);
    } finally {
      setSavingNote(null);
    }
  };

  const deleteNote = async (techniqueId: string, noteId: string) => {
    if (!user) return;
    if (!confirm('Delete this note?')) return;

    try {
      const res = await fetch('/api/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      });

      if (res.ok) {
        setTechniqueNotes(prev => ({
          ...prev,
          [techniqueId]: (prev[techniqueId] || []).filter(n => n.id !== noteId),
        }));
      }
    } catch (error) {
      console.error('Delete note error:', error);
    }
  };

  const formatNoteDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRatingColor = (rating: number | null) => {
    if (rating === null || rating === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (rating === 1) return 'bg-gray-200 dark:bg-gray-600';
    if (rating === 2) return 'bg-blue-100 dark:bg-blue-900';
    if (rating === 3) return 'bg-purple-100 dark:bg-purple-900';
    if (rating === 4) return 'bg-amber-100 dark:bg-amber-900';
    if (rating >= 5) return 'bg-green-100 dark:bg-green-900';
    return 'bg-gray-100';
  };

  // Separate working on techniques
  const workingOnTechniques = techniques.filter(t => t.workingOn);
  const filteredTechniques = showWorkingOnOnly 
    ? workingOnTechniques 
    : techniques;

  const groupedTechniques = filteredTechniques.reduce((acc, technique) => {
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

        {/* Bulk Actions Bar */}
        {user && selectedTechniques.size > 0 && (
          <div className="sticky top-0 z-10 mb-4 bg-blue-600 text-white rounded-xl shadow-lg p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {selectedTechniques.size} technique{selectedTechniques.size !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedTechniques(new Set())}
                  className="p-1 hover:bg-blue-500 rounded"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={bulkRating}
                  onChange={(e) => setBulkRating(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-4 py-2 border border-blue-400 rounded-lg bg-blue-700 text-white focus:ring-2 focus:ring-white"
                >
                  <option value="">Select rating...</option>
                  {RATING_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  onClick={saveBulkRatings}
                  disabled={bulkRating === '' || savingBulk}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingBulk ? 'Saving...' : 'Apply Rating'}
                </button>
              </div>
            </div>
          </div>
        )}

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
          <div className="space-y-4">
            {/* Controls Row */}
            <div className="flex flex-wrap items-center gap-4 justify-between">
              {/* Left side controls */}
              <div className="flex items-center gap-4">
                {user && (
                  <button
                    onClick={selectAll}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    {selectedTechniques.size === filteredTechniques.length ? (
                      <CheckSquare size={18} className="text-blue-600" />
                    ) : (
                      <Square size={18} />
                    )}
                    Select all ({filteredTechniques.length})
                  </button>
                )}
                
                {/* Working On Filter */}
                {user && workingOnTechniques.length > 0 && (
                  <button
                    onClick={() => setShowWorkingOnOnly(!showWorkingOnOnly)}
                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${
                      showWorkingOnOnly 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Star size={16} className={showWorkingOnOnly ? 'fill-yellow-500' : ''} />
                    Working On ({workingOnTechniques.length})
                  </button>
                )}
              </div>
              
              {/* Expand/Collapse buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={expandAll}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Expand All
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={collapseAll}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Collapse All
                </button>
              </div>
            </div>

            {Object.entries(groupedTechniques).map(([position, techs]) => {
              const allInPositionSelected = techs.every(t => selectedTechniques.has(t.id));
              const someInPositionSelected = techs.some(t => selectedTechniques.has(t.id));
              const isCollapsed = collapsedGroups.has(position);
              const workingOnCount = techs.filter(t => t.workingOn).length;
              
              return (
              <div key={position} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <button
                  onClick={() => toggleGroupCollapse(position)}
                  className="w-full bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {user && (
                    <div
                      onClick={(e) => { e.stopPropagation(); selectAllInPosition(position); }}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {allInPositionSelected ? (
                        <CheckSquare size={20} className="text-blue-600" />
                      ) : someInPositionSelected ? (
                        <CheckSquare size={20} className="text-blue-400" />
                      ) : (
                        <Square size={20} />
                      )}
                    </div>
                  )}
                  <div className="flex-1 flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                      {position} <span className="text-gray-500">({techs.length})</span>
                    </h2>
                    {workingOnCount > 0 && (
                      <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                        <Star size={12} className="fill-yellow-500" />
                        {workingOnCount}
                      </span>
                    )}
                  </div>
                  {isCollapsed ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronUp size={20} className="text-gray-500" />}
                </button>
                
                {!isCollapsed && (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {techs.map((technique) => (
                    <div key={technique.id} className={`p-4 ${selectedTechniques.has(technique.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                      <div className="flex items-center gap-4">
                        {/* Checkbox */}
                        {user && (
                          <button
                            onClick={() => toggleTechniqueSelection(technique.id)}
                            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {selectedTechniques.has(technique.id) ? (
                              <CheckSquare size={20} className="text-blue-600" />
                            ) : (
                              <Square size={20} />
                            )}
                          </button>
                        )}

                        {/* Working On Star */}
                        {user && (
                          <button
                            onClick={() => toggleWorkingOn(technique.id, technique.workingOn)}
                            className={`flex-shrink-0 ${technique.workingOn ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                            title={technique.workingOn ? 'Remove from Working On' : 'Add to Working On'}
                          >
                            <Star size={20} className={technique.workingOn ? 'fill-yellow-500' : ''} />
                          </button>
                        )}

                        {/* Technique Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
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
                            <h3 className="font-medium text-gray-900 dark:text-white truncate">
                              {technique.name}
                            </h3>
                            {/* Videos button */}
                            {technique.videos && technique.videos.length > 0 && (
                              <button
                                onClick={() => {
                                  const newExpanded = new Set(expandedVideos);
                                  if (newExpanded.has(technique.id)) {
                                    newExpanded.delete(technique.id);
                                  } else {
                                    newExpanded.add(technique.id);
                                  }
                                  setExpandedVideos(newExpanded);
                                }}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                              >
                                <Play size={12} />
                                {technique.videos.length} video{technique.videos.length > 1 ? 's' : ''}
                              </button>
                            )}
                            {/* Notes button */}
                            {user && (
                              <button
                                onClick={() => toggleNotesExpanded(technique.id)}
                                className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                                  expandedNotes.has(technique.id)
                                    ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                                }`}
                              >
                                <MessageSquare size={12} />
                                Notes
                                {techniqueNotes[technique.id]?.length > 0 && (
                                  <span className="ml-1 bg-blue-600 text-white rounded-full px-1.5 text-xs">
                                    {techniqueNotes[technique.id].length}
                                  </span>
                                )}
                              </button>
                            )}
                          </div>
                          {technique.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                              {technique.description}
                            </p>
                          )}
                          {/* Expanded Videos List */}
                          {expandedVideos.has(technique.id) && technique.videos && technique.videos.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Instructionals:</p>
                              {technique.videos.map(video => (
                                <a
                                  key={video.id}
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                  <Play size={16} className="text-red-600 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{video.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {video.instructor && <span>{video.instructor}</span>}
                                      {video.instructor && video.duration && <span> • </span>}
                                      {video.duration && <span>{video.duration}</span>}
                                    </p>
                                  </div>
                                  <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Expanded Notes Section */}
                          {user && expandedNotes.has(technique.id) && (
                            <div className="mt-3 space-y-3">
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Notes:</p>
                              
                              {/* Add Note Form */}
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newNoteText[technique.id] || ''}
                                  onChange={(e) => setNewNoteText(prev => ({ ...prev, [technique.id]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      addNote(technique.id);
                                    }
                                  }}
                                  placeholder="Add a note..."
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  onClick={() => addNote(technique.id)}
                                  disabled={!newNoteText[technique.id]?.trim() || savingNote === technique.id}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                >
                                  <Plus size={16} />
                                  {savingNote === technique.id ? 'Adding...' : 'Add'}
                                </button>
                              </div>

                              {/* Notes List */}
                              {loadingNotes.has(technique.id) ? (
                                <div className="text-sm text-gray-500 dark:text-gray-400 py-2">Loading notes...</div>
                              ) : techniqueNotes[technique.id]?.length > 0 ? (
                                <div className="space-y-2">
                                  {techniqueNotes[technique.id].map(note => (
                                    <div
                                      key={note.id}
                                      className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg group"
                                    >
                                      <MessageSquare size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{note.content}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatNoteDate(note.createdAt)}</p>
                                      </div>
                                      <button
                                        onClick={() => deleteNote(technique.id, note.id)}
                                        className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete note"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 py-2">No notes yet. Add your first note above!</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Rating Dropdown */}
                        <div className="flex-shrink-0">
                          <select
                            value={technique.rating ?? 0}
                            onChange={(e) => saveRating(technique.id, Number(e.target.value))}
                            disabled={!user || savingRating === technique.id}
                            className={`px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 ${getRatingColor(technique.rating)} ${
                              !user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                            }`}
                          >
                            {RATING_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
