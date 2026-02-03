'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { ArrowLeft, MapPin, Calendar, Globe, User as UserIcon, Check, Plus, Trash2, Edit2 } from 'lucide-react';

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
}

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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit profile state
  const [profileForm, setProfileForm] = useState({
    name: '',
    isPublic: false,
    birthDate: '',
    country: '',
    city: '',
    gym: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Belt history state
  const [beltHistory, setBeltHistory] = useState<BeltHistoryEntry[]>([]);
  const [addingBeltHistory, setAddingBeltHistory] = useState(false);
  const [newBeltEntry, setNewBeltEntry] = useState({ belt: '', achievedAt: '' });
  const [savingBeltHistory, setSavingBeltHistory] = useState(false);
  const [editingBeltId, setEditingBeltId] = useState<string | null>(null);
  const [editBeltEntry, setEditBeltEntry] = useState({ belt: '', achievedAt: '' });

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
        isPublic: data.user.isPublic,
        birthDate: data.user.birthDate ? data.user.birthDate.split('T')[0] : '',
        country: data.user.country || '',
        city: data.user.city || '',
        gym: data.user.gym || '',
      });
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
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
        setUser(prev => prev ? { ...prev, ...data.user } : null);
      }
    } catch (error) {
      console.error('Save profile error:', error);
    } finally {
      setSavingProfile(false);
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
        const updatedHistory = [...beltHistory, data.entry].sort((a, b) => 
          new Date(a.achievedAt).getTime() - new Date(b.achievedAt).getTime()
        );
        setBeltHistory(updatedHistory);
        const mostRecentBelt = updatedHistory[updatedHistory.length - 1]?.belt || 'white';
        setUser(prev => prev ? { ...prev, belt: mostRecentBelt } : null);
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
        const updatedHistory = beltHistory.filter(e => e.id !== entryId);
        setBeltHistory(updatedHistory);
        const mostRecentBelt = updatedHistory[updatedHistory.length - 1]?.belt || 'white';
        setUser(prev => prev ? { ...prev, belt: mostRecentBelt } : null);
      }
    } catch (error) {
      console.error('Delete belt history error:', error);
    }
  };

  const startEditingBelt = (entry: BeltHistoryEntry) => {
    setEditingBeltId(entry.id);
    setEditBeltEntry({
      belt: entry.belt,
      achievedAt: entry.achievedAt.split('T')[0],
    });
  };

  const cancelEditingBelt = () => {
    setEditingBeltId(null);
    setEditBeltEntry({ belt: '', achievedAt: '' });
  };

  const saveEditedBelt = async (entryId: string) => {
    if (!editBeltEntry.belt || !editBeltEntry.achievedAt) return;
    
    setSavingBeltHistory(true);
    try {
      const res = await fetch('/api/belt-history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entryId, ...editBeltEntry }),
      });
      if (res.ok) {
        const data = await res.json();
        const updatedHistory = beltHistory.map(e => 
          e.id === entryId ? data.entry : e
        ).sort((a, b) => 
          new Date(a.achievedAt).getTime() - new Date(b.achievedAt).getTime()
        );
        setBeltHistory(updatedHistory);
        const mostRecentBelt = updatedHistory[updatedHistory.length - 1]?.belt || 'white';
        setUser(prev => prev ? { ...prev, belt: mostRecentBelt } : null);
        setEditingBeltId(null);
        setEditBeltEntry({ belt: '', achievedAt: '' });
      }
    } catch (error) {
      console.error('Edit belt history error:', error);
    } finally {
      setSavingBeltHistory(false);
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

  if (!user) {
    return null;
  }

  const beltInfo = getBeltInfo(user.belt);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/myprogress"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4"
          >
            <ArrowLeft size={16} /> Back to My Progress
          </Link>
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full ${beltInfo.color} flex items-center justify-center`}
              title={`${beltInfo.label} Belt`}
            >
              <span className="text-2xl">🥋</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {beltInfo.label} Belt
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-8">
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
              Track when you received each belt. Your current belt is determined by the most recent promotion.
            </p>
            
            {beltHistory.length > 0 && (
              <div className="space-y-2 mb-4">
                {beltHistory.map((entry) => {
                  const entryBeltInfo = getBeltInfo(entry.belt);
                  const isEditing = editingBeltId === entry.id;
                  
                  if (isEditing) {
                    return (
                      <div key={entry.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg space-y-3 border border-blue-200 dark:border-blue-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Belt
                            </label>
                            <select
                              value={editBeltEntry.belt}
                              onChange={(e) => setEditBeltEntry(prev => ({ ...prev, belt: e.target.value }))}
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
                              value={editBeltEntry.achievedAt}
                              onChange={(e) => setEditBeltEntry(prev => ({ ...prev, achievedAt: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEditedBelt(entry.id)}
                            disabled={savingBeltHistory || !editBeltEntry.belt || !editBeltEntry.achievedAt}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                          >
                            <Check size={16} /> Save
                          </button>
                          <button
                            onClick={cancelEditingBelt}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  }
                  
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
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditingBelt(entry)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteBeltHistoryEntry(entry.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
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
      </main>
    </div>
  );
}
