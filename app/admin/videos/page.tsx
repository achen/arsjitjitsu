'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Search, Check, X, Play, Loader2, Plus, CheckCircle } from 'lucide-react';

interface ScrapedVideo {
  id: number;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  giNogi: string[];
  positions: string[];
  techniqueTypes: string[];
  isMapped?: boolean;
}

interface Technique {
  id: string;
  name: string;
  position: string;
  type: string;
  giType: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Stats {
  total: number;
  mapped: number;
  unmapped: number;
}

const POSITIONS = [
  'Mount Top', 'Mount Bottom', 'Side Control Top', 'Side Control Bottom',
  'Back Control', 'Back Defense', 'Closed Guard Top', 'Closed Guard Bottom',
  'Half Guard Top', 'Half Guard Bottom', 'Butterfly Guard', 'Butterfly Half',
  'De La Riva Guard', 'Reverse De La Riva', 'Spider Guard', 'Lasso Guard', 'Collar Sleeve Guard', 'X-Guard', 'Single Leg X',
  '50/50', 'Knee Shield', 'Z-Guard', 'Lockdown', 'Octopus Guard', 'High Ground', 'K Guard',
  'Rubber Guard', 'Worm Guard', 'Waiter Guard', 'Williams Guard', 'Standing',
  'Turtle Top', 'Turtle Bottom', 'North-South Top', 'North-South Bottom',
  'Knee on Belly Top', 'Knee on Belly Bottom', 'Crucifix', 'Truck',
  'Ashi Garami', 'Outside Ashi', 'Saddle', 'Backside 50/50', 'False Reap', 'Sambo Knot',
  'Kesa Gatame', 'Kuzure Kesa Gatame',
];

const TYPES = [
  'Escape', 'Sweep', 'Reversal', 'Takedown', 'Submission', 'Pass', 'Transition', 'Setup', 'Defense', 'Variant', 'Entry'
];

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<ScrapedVideo[]>([]);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  
  // Filters for videos
  const [videoSearch, setVideoSearch] = useState('');
  const [videoPosition, setVideoPosition] = useState('');
  const [videoInstructor, setVideoInstructor] = useState('');
  const [mappedFilter, setMappedFilter] = useState<'unmapped' | 'all' | 'mapped'>('unmapped');
  const [availablePositions, setAvailablePositions] = useState<string[]>([]);
  const [availableInstructors, setAvailableInstructors] = useState<string[]>([]);
  
  // Selected video for mapping
  const [selectedVideo, setSelectedVideo] = useState<ScrapedVideo | null>(null);
  
  // Filters for techniques
  const [techSearch, setTechSearch] = useState('');
  const [techPosition, setTechPosition] = useState('');
  const [techType, setTechType] = useState('');
  
  // Mapping state
  const [mapping, setMapping] = useState(false);
  const [mapSuccess, setMapSuccess] = useState<string | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // New technique form
  const [showNewTechniqueForm, setShowNewTechniqueForm] = useState(false);
  const [newTechnique, setNewTechnique] = useState({
    name: '',
    position: '',
    type: 'Submission',
    description: '',
    giType: 'both',
  });
  const [creatingTechnique, setCreatingTechnique] = useState(false);

  // Check auth and load data
  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (authRes.ok) {
        const data = await authRes.json();
        if (data.user?.isAdmin) {
          setIsAdmin(true);
          loadVideos(1);
          loadTechniques();
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async (page: number = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        mapped: mappedFilter,
        ...(videoSearch && { search: videoSearch }),
        ...(videoPosition && { position: videoPosition }),
        ...(videoInstructor && { instructor: videoInstructor }),
      });

      const res = await fetch(`/api/admin/videos?${params}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data.videos);
        setPagination(data.pagination);
        setAvailablePositions(data.filters.positions);
        setAvailableInstructors(data.filters.instructors);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Load videos error:', error);
    }
  };

  const loadTechniques = async () => {
    try {
      const res = await fetch('/api/techniques');
      if (res.ok) {
        const data = await res.json();
        setTechniques(data.techniques);
      }
    } catch (error) {
      console.error('Load techniques error:', error);
    }
  };

  const handleVideoSearch = () => {
    loadVideos(1);
  };
  
  // Reload videos when mapped filter changes
  useEffect(() => {
    if (isAdmin) {
      loadVideos(1);
    }
  }, [mappedFilter]);

  const mapVideoToTechnique = async (technique: Technique) => {
    if (!selectedVideo) return;
    
    setMapping(true);
    setMapSuccess(null);
    setMapError(null);

    try {
      const res = await fetch('/api/admin/videos/map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          techniqueId: technique.id,
          title: selectedVideo.title,
          url: selectedVideo.youtubeUrl,
          instructor: selectedVideo.instructor,
          duration: selectedVideo.duration,
        }),
      });

      if (res.ok) {
        setMapSuccess(`Mapped to "${technique.name}"`);
        // Mark video as mapped locally
        setVideos(prev => prev.map(v => 
          v.id === selectedVideo.id ? { ...v, isMapped: true } : v
        ));
        // Update stats
        if (stats) {
          setStats({ ...stats, mapped: stats.mapped + 1, unmapped: stats.unmapped - 1 });
        }
        setTimeout(() => setMapSuccess(null), 3000);
      } else {
        const data = await res.json();
        setMapError(data.error || 'Failed to map video');
        setTimeout(() => setMapError(null), 3000);
      }
    } catch (error) {
      setMapError('Network error');
      setTimeout(() => setMapError(null), 3000);
    } finally {
      setMapping(false);
    }
  };

  const createTechniqueAndMap = async () => {
    if (!selectedVideo || !newTechnique.name || !newTechnique.position) {
      setMapError('Please fill in technique name and position');
      setTimeout(() => setMapError(null), 3000);
      return;
    }
    
    setCreatingTechnique(true);
    setMapSuccess(null);
    setMapError(null);

    try {
      // Create the technique
      const createRes = await fetch('/api/admin/techniques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTechnique),
      });

      if (!createRes.ok) {
        const data = await createRes.json();
        setMapError(data.error || 'Failed to create technique');
        setTimeout(() => setMapError(null), 3000);
        setCreatingTechnique(false);
        return;
      }

      const { technique } = await createRes.json();

      // Map the video to the new technique
      const mapRes = await fetch('/api/admin/videos/map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          techniqueId: technique.id,
          title: selectedVideo.title,
          url: selectedVideo.youtubeUrl,
          instructor: selectedVideo.instructor,
          duration: selectedVideo.duration,
        }),
      });

      if (mapRes.ok) {
        setMapSuccess(`Created "${technique.name}" and mapped video!`);
        // Add to techniques list
        setTechniques(prev => [...prev, technique].sort((a, b) => a.name.localeCompare(b.name)));
        // Mark video as mapped locally
        setVideos(prev => prev.map(v => 
          v.id === selectedVideo.id ? { ...v, isMapped: true } : v
        ));
        // Update stats
        if (stats) {
          setStats({ ...stats, mapped: stats.mapped + 1, unmapped: stats.unmapped - 1 });
        }
        // Reset form
        setShowNewTechniqueForm(false);
        setNewTechnique({ name: '', position: '', type: 'Submission', description: '', giType: 'both' });
        setTimeout(() => setMapSuccess(null), 3000);
      } else {
        const data = await mapRes.json();
        setMapError(`Created technique but failed to map: ${data.error}`);
        setTimeout(() => setMapError(null), 5000);
      }
    } catch (error) {
      setMapError('Network error');
      setTimeout(() => setMapError(null), 3000);
    } finally {
      setCreatingTechnique(false);
    }
  };

  // Filter techniques locally
  const filteredTechniques = techniques.filter(t => {
    if (techSearch && !t.name.toLowerCase().includes(techSearch.toLowerCase())) return false;
    if (techPosition && t.position !== techPosition) return false;
    if (techType && t.type !== techType) return false;
    return true;
  });

  // Get unique positions and types from techniques
  const techniquePositions = [...new Set(techniques.map(t => t.position))].sort();
  const techniqueTypes = [...new Set(techniques.map(t => t.type))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Access Denied:</strong> You must be an admin to view this page.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🎬 Video Mapping
        </h1>
        
        {/* Stats */}
        {stats && (
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {stats.total.toLocaleString()} total videos • 
            <span className="text-green-600"> {stats.mapped.toLocaleString()} mapped</span> • 
            <span className="text-orange-600"> {stats.unmapped.toLocaleString()} unmapped</span>
          </p>
        )}

        {/* Success/Error Messages */}
        {mapSuccess && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center gap-2">
            <Check size={18} />
            {mapSuccess}
          </div>
        )}
        {mapError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
            <X size={18} />
            {mapError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Videos */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Videos ({pagination?.total || 0})
            </h2>

            {/* Video Filters */}
            <div className="space-y-3 mb-4">
              {/* Mapped filter toggle */}
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <button
                  onClick={() => setMappedFilter('unmapped')}
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    mappedFilter === 'unmapped'
                      ? 'bg-white dark:bg-gray-600 shadow text-orange-600 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Unmapped
                </button>
                <button
                  onClick={() => setMappedFilter('all')}
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    mappedFilter === 'all'
                      ? 'bg-white dark:bg-gray-600 shadow text-blue-600 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setMappedFilter('mapped')}
                  className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                    mappedFilter === 'mapped'
                      ? 'bg-white dark:bg-gray-600 shadow text-green-600 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Mapped
                </button>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={videoSearch}
                  onChange={(e) => setVideoSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVideoSearch()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleVideoSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Search size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={videoPosition}
                  onChange={(e) => {
                    setVideoPosition(e.target.value);
                    setTimeout(() => loadVideos(1), 0);
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Positions</option>
                  {availablePositions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                
                <select
                  value={videoInstructor}
                  onChange={(e) => {
                    setVideoInstructor(e.target.value);
                    setTimeout(() => loadVideos(1), 0);
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Instructors</option>
                  {availableInstructors.map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Video List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {videos.map(video => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedVideo?.id === video.id
                      ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                      : video.isMapped
                        ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-24 h-16 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/default.jpg`;
                        }}
                      />
                      {video.isMapped && (
                        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                          <CheckCircle size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {video.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {video.instructor} • {video.duration}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {video.positions.slice(0, 2).map(p => (
                          <span key={p} className="px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 rounded">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Play size={20} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => loadVideos(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => loadVideos(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Techniques */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Techniques ({filteredTechniques.length})
              </h2>
              {selectedVideo && (
                <button
                  onClick={() => setShowNewTechniqueForm(!showNewTechniqueForm)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    showNewTechniqueForm
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <Plus size={16} />
                  {showNewTechniqueForm ? 'Cancel' : 'New Technique'}
                </button>
              )}
            </div>

            {/* Selected Video Preview */}
            {selectedVideo && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Selected Video:
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 line-clamp-2">
                  {selectedVideo.title}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedVideo.techniqueTypes.slice(0, 5).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* New Technique Form */}
            {showNewTechniqueForm && selectedVideo && (
              <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <h3 className="font-medium text-green-800 dark:text-green-200 mb-3">
                  Create New Technique & Map Video
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Technique Name *"
                    value={newTechnique.name}
                    onChange={(e) => setNewTechnique(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newTechnique.position}
                      onChange={(e) => setNewTechnique(prev => ({ ...prev, position: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Position *</option>
                      {POSITIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    
                    <select
                      value={newTechnique.type}
                      onChange={(e) => setNewTechnique(prev => ({ ...prev, type: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newTechnique.giType}
                      onChange={(e) => setNewTechnique(prev => ({ ...prev, giType: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="both">Both (Gi & No-Gi)</option>
                      <option value="gi">Gi Only</option>
                      <option value="nogi">No-Gi Only</option>
                    </select>
                    
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={newTechnique.description}
                      onChange={(e) => setNewTechnique(prev => ({ ...prev, description: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <button
                    onClick={createTechniqueAndMap}
                    disabled={creatingTechnique || !newTechnique.name || !newTechnique.position}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creatingTechnique ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Create & Map
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Technique Filters */}
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Search techniques..."
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={techPosition}
                  onChange={(e) => setTechPosition(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Positions</option>
                  {techniquePositions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                
                <select
                  value={techType}
                  onChange={(e) => setTechType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  {techniqueTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Technique List */}
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {!selectedVideo ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  Select a video from the left to map it to a technique
                </p>
              ) : filteredTechniques.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No techniques match your filters. Try creating a new one!
                </p>
              ) : (
                filteredTechniques.map(technique => (
                  <button
                    key={technique.id}
                    onClick={() => mapVideoToTechnique(technique)}
                    disabled={mapping}
                    className="w-full p-2 text-left rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {technique.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {technique.position} • {technique.type}
                          {technique.giType !== 'both' && ` • ${technique.giType}`}
                        </p>
                      </div>
                      <Check size={18} className="text-green-600 opacity-0 group-hover:opacity-100" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
