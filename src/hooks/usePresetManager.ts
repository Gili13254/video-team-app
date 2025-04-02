"use client";

import { useEffect } from 'react';
import { useVideoEditor, Preset } from '@/lib/video-editor-context';
import { useSession } from 'next-auth/react';

export function usePresetManager() {
  const { presets, setPresets, selectedPreset, setSelectedPreset } = useVideoEditor();
  const { data: session } = useSession();

  // Fetch presets on component mount
  useEffect(() => {
    const fetchPresets = async () => {
      if (!session?.user?.id) return;
      
      try {
        const userId = session.user.id;
        const response = await fetch(`/api/presets?userId=${userId}&includePublic=true`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch presets');
        }
        
        const data = await response.json();
        setPresets(data.presets);
        
        // Select first preset if none selected
        if (data.presets.length > 0 && !selectedPreset) {
          setSelectedPreset(data.presets[0]);
        }
      } catch (error) {
        console.error('Error fetching presets:', error);
      }
    };
    
    fetchPresets();
  }, [session?.user?.id, setPresets, selectedPreset, setSelectedPreset]);

  // Create a new preset
  const createPreset = async (preset: Omit<Preset, 'id' | 'createdBy'>) => {
    if (!session?.user?.id) return null;
    
    try {
      const newPreset: Preset = {
        id: crypto.randomUUID(),
        ...preset,
        createdBy: session.user.id
      };
      
      const response = await fetch('/api/presets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreset),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create preset');
      }
      
      const data = await response.json();
      
      // Update local state
      setPresets([...presets, data.preset]);
      setSelectedPreset(data.preset);
      
      return data.preset;
    } catch (error) {
      console.error('Error creating preset:', error);
      return null;
    }
  };

  // Update an existing preset
  const updatePreset = async (id: string, updates: Partial<Preset>) => {
    try {
      const response = await fetch(`/api/presets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update preset');
      }
      
      const data = await response.json();
      
      // Update local state
      const updatedPresets = presets.map(p => 
        p.id === id ? data.preset : p
      );
      setPresets(updatedPresets);
      
      if (selectedPreset?.id === id) {
        setSelectedPreset(data.preset);
      }
      
      return data.preset;
    } catch (error) {
      console.error('Error updating preset:', error);
      return null;
    }
  };

  // Delete a preset
  const deletePreset = async (id: string) => {
    try {
      const response = await fetch(`/api/presets/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete preset');
      }
      
      // Update local state
      const filteredPresets = presets.filter(p => p.id !== id);
      setPresets(filteredPresets);
      
      if (selectedPreset?.id === id) {
        setSelectedPreset(filteredPresets.length > 0 ? filteredPresets[0] : null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting preset:', error);
      return false;
    }
  };

  // Share a preset (make it public)
  const sharePreset = async (id: string) => {
    return updatePreset(id, { isPublic: true });
  };

  return {
    presets,
    selectedPreset,
    setSelectedPreset,
    createPreset,
    updatePreset,
    deletePreset,
    sharePreset,
  };
}
