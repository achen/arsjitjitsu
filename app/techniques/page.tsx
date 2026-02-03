'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Search, Filter, ChevronDown, ChevronUp, CheckSquare, Square, X, Star, Play, ExternalLink, MessageSquare, Plus, Trash2, Edit2, Link2, Loader2, Copy, ArrowRight } from 'lucide-react';

interface TechniqueVideo {
  id: string;
  title: string;
  url: string;
  instructor: string | null;
  duration: string | null;
  isBookmarked?: boolean;
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
  giType: string;
  rating: number | null;
  notes: string | null;
  workingOn: boolean;
  videos: TechniqueVideo[];
}

interface User {
  id: string;
  name: string;
  isAdmin?: boolean;
}

interface Position {
  id: string;
  name: string;
  description: string | null;
  alternateNames: string[];
  sortOrder: number;
}

const POSITIONS = [
  'Mount Top', 'Mount Bottom', 'Side Control Top', 'Side Control Bottom',
  'Back Control', 'Back Defense', 'Closed Guard Top', 'Closed Guard Bottom',
  'Half Guard Top', 'Half Guard Bottom', 'Butterfly Guard', 'Butterfly Half',
  'De La Riva Guard', 'Reverse De La Riva', 'Spider Guard', 'Lasso Guard', 'Collar Sleeve Guard', 'X-Guard', 'Single Leg X',
  '50/50', 'Knee Shield', 'Z-Guard', 'Lockdown', 'Octopus Guard', 'High Ground', 'K Guard',
  'Rubber Guard', 'Worm Guard', 'Waiter Guard', 'Standing',
  'Turtle Top', 'Turtle Bottom', 'North-South Top', 'North-South Bottom',
  'Knee on Belly', 'Crucifix', 'Leg Entanglement'
];

const TYPES = [
  'Escape', 'Sweep', 'Reversal', 'Takedown', 'Submission', 'Pass', 'Transition', 'Setup', 'Defense', 'Variant'
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

const GI_OPTIONS = [
  { value: 'all', label: 'All (Gi & No-Gi)' },
  { value: 'gi', label: 'Gi Only' },
  { value: 'nogi', label: 'No-Gi Only' },
];

export default function TechniquesPage() {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
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
  
  // Gi filter state (persisted in localStorage)
  const [giFilter, setGiFilter] = useState<string>('all');
  
  // Notes state
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [techniqueNotes, setTechniqueNotes] = useState<Record<string, TechniqueNote[]>>({});
  const [loadingNotes, setLoadingNotes] = useState<Set<string>>(new Set());
  const [newNoteText, setNewNoteText] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);
  
  // Bookmarks state
  const [bookmarkedVideos, setBookmarkedVideos] = useState<Set<string>>(new Set());
  const [togglingBookmark, setTogglingBookmark] = useState<string | null>(null);
  
  // Admin edit state
  const [editingTechnique, setEditingTechnique] = useState<Technique | null>(null);
  const [editForm, setEditForm] = useState({ name: '', position: '', type: '', description: '', giType: 'nogi' });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  
  // Admin create state
  const [creatingForPosition, setCreatingForPosition] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ name: '', type: 'Submission', description: '', giType: 'nogi' });
  const [savingCreate, setSavingCreate] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
  // Admin delete video state
  const [deletingVideo, setDeletingVideo] = useState<string | null>(null);
  
  // Admin duplicate state
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  
  // Admin add video state
  const [addingVideoToTechnique, setAddingVideoToTechnique] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoMeta, setVideoMeta] = useState<{ title: string; instructor: string } | null>(null);
  const [fetchingVideoMeta, setFetchingVideoMeta] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const [addVideoError, setAddVideoError] = useState<string | null>(null);
  
  // Admin reassign video state
  const [reassigningVideo, setReassigningVideo] = useState<{ videoId: string; currentTechniqueId: string; title: string } | null>(null);
  const [reassignTechniqueId, setReassignTechniqueId] = useState('');
  const [reassignSearch, setReassignSearch] = useState('');
  const [savingReassign, setSavingReassign] = useState(false);
  
  // Create technique in reassign modal state
  const [showReassignCreateForm, setShowReassignCreateForm] = useState(false);
  const [reassignCreateForm, setReassignCreateForm] = useState({ name: '', position: '', type: 'Submission', giType: 'nogi' });
  const [savingReassignCreate, setSavingReassignCreate] = useState(false);
  const [reassignCreateError, setReassignCreateError] = useState<string | null>(null);
  const [scrollToTechniqueId, setScrollToTechniqueId] = useState<string | null>(null);

  // Admin position edit state
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [positionEditForm, setPositionEditForm] = useState({ name: '', description: '', alternateNames: '' });
  const [savingPositionEdit, setSavingPositionEdit] = useState(false);
  const [positionEditError, setPositionEditError] = useState<string | null>(null);
  
  // Admin create position state
  const [showCreatePosition, setShowCreatePosition] = useState(false);
  const [createPositionForm, setCreatePositionForm] = useState({ name: '', description: '', alternateNames: '' });
  const [savingCreatePosition, setSavingCreatePosition] = useState(false);
  const [createPositionError, setCreatePositionError] = useState<string | null>(null);

  // Get unique positions from techniques for the edit dropdown
  const uniquePositions = [...new Set(techniques.map(t => t.position))].sort();

  // Scroll to newly created technique in reassign modal
  useEffect(() => {
    if (scrollToTechniqueId) {
      const element = document.getElementById(`reassign-tech-${scrollToTechniqueId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setScrollToTechniqueId(null);
    }
  }, [scrollToTechniqueId]);

  // Load collapsed groups from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('collapsedGroups');
    if (saved) {
      setCollapsedGroups(new Set(JSON.parse(saved)));
    } else {
      // All collapsed by default - will be set after techniques load
    }
  }, []);

  // Load gi filter preference from localStorage
  useEffect(() => {
    const savedGiFilter = localStorage.getItem('giFilter');
    if (savedGiFilter) {
      setGiFilter(savedGiFilter);
    }
  }, []);

  // Save gi filter preference to localStorage
  const handleGiFilterChange = (value: string) => {
    setGiFilter(value);
    localStorage.setItem('giFilter', value);
  };

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
    fetchBookmarks();
    fetchPositions();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch('/api/bookmarks');
      if (res.ok) {
        const data = await res.json();
        setBookmarkedVideos(new Set(data.bookmarks));
      }
    } catch (error) {
      console.error('Fetch bookmarks error:', error);
    }
  };

  const toggleBookmark = async (videoId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }

    setTogglingBookmark(videoId);
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookmarkedVideos(prev => {
          const newSet = new Set(prev);
          if (data.bookmarked) {
            newSet.add(videoId);
          } else {
            newSet.delete(videoId);
          }
          return newSet;
        });
      }
    } catch (error) {
      console.error('Toggle bookmark error:', error);
    } finally {
      setTogglingBookmark(null);
    }
  };

  const openEditModal = (technique: Technique) => {
    setEditingTechnique(technique);
    setEditForm({
      name: technique.name,
      position: technique.position,
      type: technique.type,
      description: technique.description || '',
      giType: technique.giType,
    });
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditingTechnique(null);
    setEditForm({ name: '', position: '', type: '', description: '', giType: 'nogi' });
    setEditError(null);
  };

  const saveTechniqueEdit = async () => {
    if (!editingTechnique) return;
    
    setSavingEdit(true);
    setEditError(null);
    
    try {
      const res = await fetch('/api/admin/techniques', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTechnique.id,
          ...editForm,
        }),
      });

      if (res.ok) {
        const { technique } = await res.json();
        setTechniques(prev => prev.map(t => 
          t.id === technique.id 
            ? { ...t, ...technique }
            : t
        ));
        closeEditModal();
      } else {
        const data = await res.json();
        setEditError(data.error || 'Failed to save');
      }
    } catch (error) {
      setEditError('Network error');
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteTechnique = async () => {
    if (!editingTechnique) return;
    if (!confirm(`Are you sure you want to delete "${editingTechnique.name}"? This cannot be undone.`)) return;
    
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/admin/techniques?id=${editingTechnique.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTechniques(prev => prev.filter(t => t.id !== editingTechnique.id));
        closeEditModal();
      } else {
        const data = await res.json();
        setEditError(data.error || 'Failed to delete');
      }
    } catch (error) {
      setEditError('Network error');
    } finally {
      setSavingEdit(false);
    }
  };

  const duplicateTechnique = async (technique: Technique) => {
    setDuplicatingId(technique.id);
    
    try {
      const res = await fetch('/api/admin/techniques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${technique.name} (Copy)`,
          position: technique.position,
          type: technique.type,
          description: technique.description || null,
          giType: technique.giType,
        }),
      });

      if (res.ok) {
        const { technique: newTechnique } = await res.json();
        setTechniques(prev => [...prev, { ...newTechnique, rating: null, workingOn: false, videos: [] }]);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to duplicate');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setDuplicatingId(null);
    }
  };

  const openCreateModal = (position: string) => {
    setCreatingForPosition(position);
    setCreateForm({ name: '', type: 'Submission', description: '', giType: 'nogi' });
    setCreateError(null);
  };

  const closeCreateModal = () => {
    setCreatingForPosition(null);
    setCreateForm({ name: '', type: 'Submission', description: '', giType: 'nogi' });
    setCreateError(null);
  };

  const createTechnique = async () => {
    if (!creatingForPosition || !createForm.name || !createForm.type) return;
    
    setSavingCreate(true);
    setCreateError(null);
    
    try {
      const res = await fetch('/api/admin/techniques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name,
          position: creatingForPosition,
          type: createForm.type,
          description: createForm.description || null,
          giType: createForm.giType,
        }),
      });

      if (res.ok) {
        const { technique } = await res.json();
        // Add the new technique to the list with default values for user-specific fields
        setTechniques(prev => [...prev, { 
          ...technique, 
          rating: null, 
          notes: null, 
          workingOn: false, 
          videos: [] 
        }]);
        closeCreateModal();
      } else {
        const data = await res.json();
        setCreateError(data.error || 'Failed to create');
      }
    } catch (error) {
      setCreateError('Network error');
    } finally {
      setSavingCreate(false);
    }
  };

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

  const fetchPositions = async () => {
    try {
      const res = await fetch('/api/admin/positions');
      if (res.ok) {
        const data = await res.json();
        setPositions(data.positions || []);
      }
    } catch (error) {
      console.error('Fetch positions error:', error);
    }
  };

  // Position edit functions
  const openPositionEditModal = (positionName: string) => {
    const pos = positions.find(p => p.name === positionName);
    if (pos) {
      setEditingPosition(pos);
      setPositionEditForm({
        name: pos.name,
        description: pos.description || '',
        alternateNames: pos.alternateNames.join(', '),
      });
      setPositionEditError(null);
    }
  };

  const closePositionEditModal = () => {
    setEditingPosition(null);
    setPositionEditForm({ name: '', description: '', alternateNames: '' });
    setPositionEditError(null);
  };

  const savePositionEdit = async () => {
    if (!editingPosition) return;
    
    setSavingPositionEdit(true);
    setPositionEditError(null);
    
    try {
      const alternateNamesArray = positionEditForm.alternateNames
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const res = await fetch('/api/admin/positions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingPosition.id,
          name: positionEditForm.name,
          description: positionEditForm.description,
          alternateNames: alternateNamesArray,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update positions list
        setPositions(prev => prev.map(p => 
          p.id === data.position.id ? data.position : p
        ));
        // If name changed, update techniques
        if (data.oldName !== data.newName) {
          setTechniques(prev => prev.map(t => 
            t.position === data.oldName ? { ...t, position: data.newName } : t
          ));
        }
        closePositionEditModal();
      } else {
        const data = await res.json();
        setPositionEditError(data.error || 'Failed to save');
      }
    } catch (error) {
      setPositionEditError('Network error');
    } finally {
      setSavingPositionEdit(false);
    }
  };

  const deletePosition = async () => {
    if (!editingPosition) return;
    if (!confirm(`Are you sure you want to delete "${editingPosition.name}"? This will only work if no techniques use this position.`)) return;
    
    setSavingPositionEdit(true);
    try {
      const res = await fetch(`/api/admin/positions?id=${editingPosition.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPositions(prev => prev.filter(p => p.id !== editingPosition.id));
        closePositionEditModal();
      } else {
        const data = await res.json();
        setPositionEditError(data.error || 'Failed to delete');
      }
    } catch (error) {
      setPositionEditError('Network error');
    } finally {
      setSavingPositionEdit(false);
    }
  };

  // Create position functions
  const openCreatePositionModal = () => {
    setShowCreatePosition(true);
    setCreatePositionForm({ name: '', description: '', alternateNames: '' });
    setCreatePositionError(null);
  };

  const closeCreatePositionModal = () => {
    setShowCreatePosition(false);
    setCreatePositionForm({ name: '', description: '', alternateNames: '' });
    setCreatePositionError(null);
  };

  const saveCreatePosition = async () => {
    setSavingCreatePosition(true);
    setCreatePositionError(null);
    
    try {
      const alternateNamesArray = createPositionForm.alternateNames
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const res = await fetch('/api/admin/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createPositionForm.name,
          description: createPositionForm.description,
          alternateNames: alternateNamesArray,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPositions(prev => [...prev, data.position]);
        closeCreatePositionModal();
        // Refresh positions list to ensure proper sort order
        fetchPositions();
      } else {
        const data = await res.json();
        setCreatePositionError(data.error || 'Failed to create');
      }
    } catch (error) {
      setCreatePositionError('Network error');
    } finally {
      setSavingCreatePosition(false);
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

  const deleteVideo = async (techniqueId: string, videoId: string) => {
    if (!user?.isAdmin) return;
    if (!confirm('Remove this video from this technique?')) return;

    setDeletingVideo(videoId);
    try {
      const res = await fetch(`/api/admin/videos/map?videoId=${videoId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // Update local state to remove the video
        setTechniques(prev => prev.map(t => {
          if (t.id === techniqueId) {
            return {
              ...t,
              videos: t.videos.filter(v => v.id !== videoId),
            };
          }
          return t;
        }));
      }
    } catch (error) {
      console.error('Delete video error:', error);
    } finally {
      setDeletingVideo(null);
    }
  };

  const openReassignModal = (videoId: string, currentTechniqueId: string, videoTitle: string) => {
    setReassigningVideo({ videoId, currentTechniqueId, title: videoTitle });
    setReassignTechniqueId('');
    setReassignSearch('');
  };

  const closeReassignModal = () => {
    setReassigningVideo(null);
    setReassignTechniqueId('');
    setReassignSearch('');
    setShowReassignCreateForm(false);
    setReassignCreateForm({ name: '', position: '', type: 'Submission', giType: 'nogi' });
    setReassignCreateError(null);
  };

  const reassignVideo = async () => {
    if (!reassigningVideo || !reassignTechniqueId) return;
    
    setSavingReassign(true);
    try {
      const res = await fetch('/api/admin/videos/map', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: reassigningVideo.videoId,
          newTechniqueId: reassignTechniqueId,
        }),
      });

      if (res.ok) {
        // Remove video from old technique and add to new one
        const video = techniques
          .find(t => t.id === reassigningVideo.currentTechniqueId)
          ?.videos.find(v => v.id === reassigningVideo.videoId);
        
        if (video) {
          setTechniques(prev => prev.map(t => {
            if (t.id === reassigningVideo.currentTechniqueId) {
              return { ...t, videos: t.videos.filter(v => v.id !== reassigningVideo.videoId) };
            }
            if (t.id === reassignTechniqueId) {
              return { ...t, videos: [...t.videos, video] };
            }
            return t;
          }));
        }
        closeReassignModal();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to reassign video');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setSavingReassign(false);
    }
  };

  // Create a new technique and select it for reassignment
  const createTechniqueForReassign = async () => {
    if (!reassignCreateForm.name || !reassignCreateForm.position || !reassignCreateForm.type) {
      setReassignCreateError('Please fill in name, position, and type');
      return;
    }
    
    setSavingReassignCreate(true);
    setReassignCreateError(null);
    
    try {
      const res = await fetch('/api/admin/techniques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reassignCreateForm.name,
          position: reassignCreateForm.position,
          type: reassignCreateForm.type,
          giType: reassignCreateForm.giType,
        }),
      });

      if (res.ok) {
        const { technique } = await res.json();
        // Add the new technique to the list with default values
        setTechniques(prev => [...prev, { 
          ...technique, 
          rating: null, 
          notes: null, 
          workingOn: false, 
          videos: [] 
        }]);
        // Auto-select the new technique and scroll to it
        setReassignTechniqueId(technique.id);
        setScrollToTechniqueId(technique.id);
        // Hide the create form and reset it
        setShowReassignCreateForm(false);
        setReassignCreateForm({ name: '', position: '', type: 'Submission', giType: 'nogi' });
      } else {
        const data = await res.json();
        setReassignCreateError(data.error || 'Failed to create technique');
      }
    } catch (error) {
      setReassignCreateError('Network error');
    } finally {
      setSavingReassignCreate(false);
    }
  };

  // Filter techniques for reassign modal
  const filteredTechniquesForReassign = techniques.filter(t => {
    if (t.id === reassigningVideo?.currentTechniqueId) return false;
    if (!reassignSearch) return true;
    const search = reassignSearch.toLowerCase();
    return t.name.toLowerCase().includes(search) || t.position.toLowerCase().includes(search);
  });

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Fetch YouTube video metadata using oEmbed
  const fetchYouTubeMetadata = async (url: string) => {
    setFetchingVideoMeta(true);
    setAddVideoError(null);
    setVideoMeta(null);

    try {
      const videoId = extractYouTubeId(url);
      if (!videoId) {
        setAddVideoError('Invalid YouTube URL');
        return;
      }

      // Use YouTube oEmbed API (no API key needed)
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const res = await fetch(oembedUrl);
      
      if (!res.ok) {
        setAddVideoError('Could not fetch video info');
        return;
      }

      const data = await res.json();
      setVideoMeta({
        title: data.title || '',
        instructor: data.author_name || '',
      });
    } catch (error) {
      console.error('Fetch YouTube metadata error:', error);
      setAddVideoError('Failed to fetch video info');
    } finally {
      setFetchingVideoMeta(false);
    }
  };

  // Handle URL paste/change
  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    setAddVideoError(null);
    
    // Auto-fetch metadata when a valid YouTube URL is detected
    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      fetchYouTubeMetadata(url);
    } else {
      setVideoMeta(null);
    }
  };

  // Open add video modal
  const openAddVideoModal = (techniqueId: string) => {
    setAddingVideoToTechnique(techniqueId);
    setVideoUrl('');
    setVideoMeta(null);
    setAddVideoError(null);
  };

  // Close add video modal
  const closeAddVideoModal = () => {
    setAddingVideoToTechnique(null);
    setVideoUrl('');
    setVideoMeta(null);
    setAddVideoError(null);
  };

  // Save video to technique
  const saveVideoToTechnique = async () => {
    if (!addingVideoToTechnique || !videoUrl || !videoMeta) return;

    setSavingVideo(true);
    setAddVideoError(null);

    try {
      const res = await fetch('/api/admin/videos/map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          techniqueId: addingVideoToTechnique,
          title: videoMeta.title,
          url: videoUrl,
          instructor: videoMeta.instructor,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state to add the video
        setTechniques(prev => prev.map(t => {
          if (t.id === addingVideoToTechnique) {
            return {
              ...t,
              videos: [...t.videos, {
                id: data.video.id,
                title: data.video.title,
                url: data.video.url,
                instructor: data.video.instructor,
                duration: data.video.duration,
              }],
            };
          }
          return t;
        }));
        closeAddVideoModal();
      } else {
        const errData = await res.json();
        setAddVideoError(errData.error || 'Failed to save video');
      }
    } catch (error) {
      console.error('Save video error:', error);
      setAddVideoError('Failed to save video');
    } finally {
      setSavingVideo(false);
    }
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

  // Apply gi filter
  const giFilteredTechniques = techniques.filter(t => {
    if (giFilter === 'all') return true;
    if (giFilter === 'gi') return t.giType === 'gi';
    if (giFilter === 'nogi') return t.giType === 'nogi';
    return true;
  });
  
  // Separate working on techniques (from gi-filtered set)
  const workingOnTechniques = giFilteredTechniques.filter(t => t.workingOn);
  
  const filteredTechniques = showWorkingOnOnly 
    ? workingOnTechniques
    : giFilteredTechniques;

  // Group techniques by position, including empty positions from the database
  const groupedTechniques = (() => {
    // Start with techniques grouped by position
    const grouped = filteredTechniques.reduce((acc, technique) => {
      if (!acc[technique.position]) {
        acc[technique.position] = [];
      }
      acc[technique.position].push(technique);
      return acc;
    }, {} as Record<string, Technique[]>);
    
    // Add empty positions from the database only when no filters are applied
    const noFiltersApplied = !selectedPosition && !selectedType && !searchQuery && !showWorkingOnOnly && giFilter === 'all';
    if (noFiltersApplied) {
      positions.forEach(pos => {
        if (!grouped[pos.name]) {
          grouped[pos.name] = [];
        }
      });
    }
    
    return grouped;
  })();

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
                    {(positions.length > 0 ? positions.map(p => p.name) : POSITIONS).map(pos => (
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
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Gi / No-Gi
                  </label>
                  <select
                    value={giFilter}
                    onChange={(e) => handleGiFilterChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {GI_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedPosition('');
                      setSelectedType('');
                      setSearchQuery('');
                      handleGiFilterChange('all');
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
                {user?.isAdmin && (
                  <button
                    onClick={openCreatePositionModal}
                    className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                  >
                    <Plus size={16} />
                    Add Position
                  </button>
                )}
                {user?.isAdmin && <span className="text-gray-400">|</span>}
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

            {Object.entries(groupedTechniques)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([position, techs]) => {
              const allInPositionSelected = techs.every(t => selectedTechniques.has(t.id));
              const someInPositionSelected = techs.some(t => selectedTechniques.has(t.id));
              const isCollapsed = collapsedGroups.has(position);
              const workingOnCount = techs.filter(t => t.workingOn).length;
              const positionData = positions.find(p => p.name === position);
              
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
                  <div className="flex-1 flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                        {position} <span className="text-gray-500">({techs.length})</span>
                      </h2>
                      {workingOnCount > 0 && (
                        <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded-full">
                          <Star size={12} className="fill-yellow-500" />
                          {workingOnCount}
                        </span>
                      )}
                      {user?.isAdmin && (
                        <button
                          onClick={(e) => { e.stopPropagation(); openPositionEditModal(position); }}
                          className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
                          title={`Edit ${position}`}
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                      )}
                      {user?.isAdmin && (
                        <button
                          onClick={(e) => { e.stopPropagation(); openCreateModal(position); }}
                          className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                          title={`Add technique to ${position}`}
                        >
                          <Plus size={12} />
                          Add
                        </button>
                      )}
                    </div>
                    {positionData?.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-left">
                        {positionData.description}
                        {positionData.alternateNames.length > 0 && (
                          <span className="ml-2 text-gray-400">
                            (Also: {positionData.alternateNames.join(', ')})
                          </span>
                        )}
                      </p>
                    )}
                    {positionData && positionData.alternateNames.length > 0 && !positionData.description && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 text-left">
                        Also known as: {positionData.alternateNames.join(', ')}
                      </p>
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
                              <span className={`text-xs font-semibold mr-1 ${technique.giType === 'gi' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                [{technique.giType === 'gi' ? 'Gi' : 'No-Gi'}]
                              </span>
                              {technique.name}
                            </h3>
                            {/* Videos button */}
                            {technique.videos && technique.videos.length > 0 && (
                              <button
                                onClick={() => {
                                  if (!user) {
                                    window.location.href = '/auth/login';
                                    return;
                                  }
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
                            {/* Admin Edit button */}
                            {user?.isAdmin && (
                              <button
                                onClick={() => openEditModal(technique)}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                              >
                                <Edit2 size={12} />
                                Edit
                              </button>
                            )}
                            {/* Admin Duplicate button */}
                            {user?.isAdmin && (
                              <button
                                onClick={() => duplicateTechnique(technique)}
                                disabled={duplicatingId === technique.id}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                              >
                                <Copy size={12} />
                                {duplicatingId === technique.id ? 'Duplicating...' : 'Duplicate'}
                              </button>
                            )}
                            {/* Admin Add Video button */}
                            {user?.isAdmin && (
                              <button
                                onClick={() => openAddVideoModal(technique.id)}
                                className="flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                              >
                                <Link2 size={12} />
                                Add Video
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
                              {[...technique.videos]
                                .sort((a, b) => {
                                  const aBookmarked = bookmarkedVideos.has(a.id);
                                  const bBookmarked = bookmarkedVideos.has(b.id);
                                  if (aBookmarked && !bBookmarked) return -1;
                                  if (!aBookmarked && bBookmarked) return 1;
                                  return 0;
                                })
                                .map(video => {
                                  const isBookmarked = bookmarkedVideos.has(video.id);
                                  return (
                                <div
                                  key={video.id}
                                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                  <button
                                    onClick={(e) => toggleBookmark(video.id, e)}
                                    disabled={togglingBookmark === video.id}
                                    className={`flex-shrink-0 p-1 rounded transition-colors ${
                                      isBookmarked 
                                        ? 'text-yellow-500 hover:text-yellow-600' 
                                        : 'text-gray-300 hover:text-yellow-400'
                                    } ${togglingBookmark === video.id ? 'opacity-50' : ''}`}
                                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark video'}
                                  >
                                    <Star size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                                  </button>
                                  <a
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 flex-1 min-w-0"
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
                                  {user?.isAdmin && (
                                    <>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openReassignModal(video.id, technique.id, video.title);
                                        }}
                                        className="flex-shrink-0 p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                        title="Move to different technique"
                                      >
                                        <ArrowRight size={14} />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteVideo(technique.id, video.id);
                                        }}
                                        disabled={deletingVideo === video.id}
                                        className="flex-shrink-0 p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                        title="Remove video from technique"
                                      >
                                        <Trash2 size={14} className={deletingVideo === video.id ? 'opacity-50' : ''} />
                                      </button>
                                    </>
                                  )}
                                </div>
                                  );
                                })}
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

      {/* Edit Technique Modal */}
      {editingTechnique && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Edit Technique
                </h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              {editError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {editError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position *
                  </label>
                  <select
                    value={editForm.position}
                    onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Position</option>
                    {uniquePositions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type *
                  </label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    {TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gi Type
                  </label>
                  <select
                    value={editForm.giType}
                    onChange={(e) => setEditForm(prev => ({ ...prev, giType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="gi">Gi</option>
                    <option value="nogi">No-Gi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={deleteTechnique}
                  disabled={savingEdit}
                  className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} className="inline mr-1" />
                  Delete
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveTechniqueEdit}
                    disabled={savingEdit || !editForm.name || !editForm.position || !editForm.type}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {savingEdit ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Technique Modal */}
      {creatingForPosition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Add Technique to {creatingForPosition}
                </h2>
                <button
                  onClick={closeCreateModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              {createError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
                  {createError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Armbar from Mount"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type *
                  </label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gi Type
                  </label>
                  <select
                    value={createForm.giType}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, giType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="gi">Gi</option>
                    <option value="nogi">No-Gi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Optional description..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeCreateModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createTechnique}
                  disabled={savingCreate || !createForm.name || !createForm.type}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {savingCreate ? 'Creating...' : 'Create Technique'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Video Modal */}
      {addingVideoToTechnique && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Add Video
                </h2>
                <button
                  onClick={closeAddVideoModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              {addVideoError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {addVideoError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    placeholder="Paste YouTube URL here..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {fetchingVideoMeta && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    Fetching video info...
                  </div>
                )}

                {videoMeta && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={videoMeta.title}
                        onChange={(e) => setVideoMeta(prev => prev ? { ...prev, title: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Instructor / Channel
                      </label>
                      <input
                        type="text"
                        value={videoMeta.instructor}
                        onChange={(e) => setVideoMeta(prev => prev ? { ...prev, instructor: e.target.value } : null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeAddVideoModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVideoToTechnique}
                  disabled={savingVideo || !videoUrl || !videoMeta}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {savingVideo ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Add Video'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Video Modal */}
      {reassigningVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Move Video to Different Technique
                </h2>
                <button
                  onClick={closeReassignModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {reassigningVideo.title}
              </p>
            </div>

            {/* Create New Technique Form */}
            {showReassignCreateForm ? (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Create New Technique</h3>
                  <button
                    onClick={() => {
                      setShowReassignCreateForm(false);
                      setReassignCreateForm({ name: '', position: '', type: 'Submission', giType: 'nogi' });
                      setReassignCreateError(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                {reassignCreateError && (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-2 rounded">
                    {reassignCreateError}
                  </div>
                )}
                
                <input
                  type="text"
                  value={reassignCreateForm.name}
                  onChange={(e) => setReassignCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Technique name *"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                
                <select
                  value={reassignCreateForm.position}
                  onChange={(e) => setReassignCreateForm(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Select position *</option>
                  {uniquePositions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
                
                <div className="flex gap-2">
                  <select
                    value={reassignCreateForm.type}
                    onChange={(e) => setReassignCreateForm(prev => ({ ...prev, type: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  
                  <select
                    value={reassignCreateForm.giType}
                    onChange={(e) => setReassignCreateForm(prev => ({ ...prev, giType: e.target.value }))}
                    className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="gi">Gi</option>
                    <option value="nogi">No-Gi</option>
                  </select>
                </div>
                
                <button
                  onClick={createTechniqueForReassign}
                  disabled={savingReassignCreate || !reassignCreateForm.name || !reassignCreateForm.position}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {savingReassignCreate ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      Create & Select
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-2">
                <input
                  type="text"
                  value={reassignSearch}
                  onChange={(e) => setReassignSearch(e.target.value)}
                  placeholder="Search techniques..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {user?.isAdmin && (
                  <button
                    onClick={() => setShowReassignCreateForm(true)}
                    className="w-full px-3 py-2 border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus size={16} />
                    Create New Technique
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-1 max-h-[50vh]">
              {filteredTechniquesForReassign.slice(0, 100).map(t => (
                <button
                  key={t.id}
                  id={`reassign-tech-${t.id}`}
                  onClick={() => setReassignTechniqueId(t.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    reassignTechniqueId === t.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <p className="font-medium text-gray-900 dark:text-white">
                    <span className={`inline-block w-12 text-xs font-medium mr-2 ${
                      t.giType === 'gi' ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
                    }`}>
                      [{t.giType === 'gi' ? 'Gi' : 'No-Gi'}]
                    </span>
                    {t.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 ml-14">
                    {t.position} • {t.type}
                  </p>
                </button>
              ))}
              {filteredTechniquesForReassign.length > 100 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                  Showing first 100 results. Refine your search for more specific results.
                </p>
              )}
              {filteredTechniquesForReassign.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No matching techniques found
                </p>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={closeReassignModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={reassignVideo}
                disabled={savingReassign || !reassignTechniqueId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {savingReassign ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Moving...
                  </>
                ) : (
                  <>
                    <ArrowRight size={16} />
                    Move Video
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Position Edit Modal */}
      {editingPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Position
              </h3>
              <button
                onClick={closePositionEditModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {positionEditError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {positionEditError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position Name *
                </label>
                <input
                  type="text"
                  value={positionEditForm.name}
                  onChange={(e) => setPositionEditForm({ ...positionEditForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Closed Guard Bottom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={positionEditForm.description}
                  onChange={(e) => setPositionEditForm({ ...positionEditForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Brief description of this position..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alternate Names
                </label>
                <input
                  type="text"
                  value={positionEditForm.alternateNames}
                  onChange={(e) => setPositionEditForm({ ...positionEditForm, alternateNames: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Comma-separated, e.g., Full Guard, Guarda Fechada"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Helps users find this position when searching
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={deletePosition}
                disabled={savingPositionEdit}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                Delete Position
              </button>
              <div className="flex gap-3">
                <button
                  onClick={closePositionEditModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={savePositionEdit}
                  disabled={savingPositionEdit || !positionEditForm.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {savingPositionEdit ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Position Modal */}
      {showCreatePosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Position
              </h3>
              <button
                onClick={closeCreatePositionModal}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {createPositionError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                  {createPositionError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Position Name *
                </label>
                <input
                  type="text"
                  value={createPositionForm.name}
                  onChange={(e) => setCreatePositionForm({ ...createPositionForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Closed Guard Bottom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={createPositionForm.description}
                  onChange={(e) => setCreatePositionForm({ ...createPositionForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Brief description of this position..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Alternate Names
                </label>
                <input
                  type="text"
                  value={createPositionForm.alternateNames}
                  onChange={(e) => setCreatePositionForm({ ...createPositionForm, alternateNames: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Comma-separated, e.g., Full Guard, Guarda Fechada"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Helps users find this position when searching
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={closeCreatePositionModal}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCreatePosition}
                disabled={savingCreatePosition || !createPositionForm.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {savingCreatePosition ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Position'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
