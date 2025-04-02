"use client";

import { usePresetManager } from "@/hooks/usePresetManager";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useVideoEditor, Preset } from "@/lib/video-editor-context";
import { PlusCircle, Save, Share2, Trash2 } from "lucide-react";

export default function PresetManager() {
  const { selectedPreset } = useVideoEditor();
  const { data: session } = useSession();
  const { 
    presets, 
    setSelectedPreset, 
    createPreset, 
    updatePreset, 
    deletePreset, 
    sharePreset 
  } = usePresetManager();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetTarget, setNewPresetTarget] = useState(-23);
  const [newPresetTolerance, setNewPresetTolerance] = useState(1);
  const [newPresetIsMonoCheck, setNewPresetIsMonoCheck] = useState(false);
  const [newPresetIsPublic, setNewPresetIsPublic] = useState(false);
  
  const handleCreatePreset = async () => {
    if (!newPresetName) return;
    
    await createPreset({
      name: newPresetName,
      target: newPresetTarget,
      tolerance: newPresetTolerance,
      isMonoCheck: newPresetIsMonoCheck,
      isPublic: newPresetIsPublic,
    });
    
    // Reset form
    setNewPresetName('');
    setIsCreating(false);
  };
  
  const handleSharePreset = async (preset: Preset) => {
    if (!session?.user?.id) return;
    await sharePreset(preset.id);
  };
  
  const handleDeletePreset = async (preset: Preset) => {
    if (!session?.user?.id) return;
    await deletePreset(preset.id);
  };
  
  return (
    <Card className="notion-card w-full mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="notion-heading">Loudness Presets</CardTitle>
            <CardDescription className="notion-text">
              Select or create presets for audio loudness targets
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCreating(!isCreating)}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            {isCreating ? 'Cancel' : 'New Preset'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isCreating ? (
          <div className="space-y-4 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium">Create New Preset</h3>
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input 
                id="preset-name" 
                value={newPresetName} 
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="e.g., Broadcast Standard"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target-lufs">Target LUFS: {newPresetTarget}</Label>
              <Slider 
                id="target-lufs"
                value={[newPresetTarget]} 
                onValueChange={(value) => setNewPresetTarget(value[0])}
                min={-30}
                max={-10}
                step={0.5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tolerance">Tolerance (±dB): {newPresetTolerance}</Label>
              <Slider 
                id="tolerance"
                value={[newPresetTolerance]} 
                onValueChange={(value) => setNewPresetTolerance(value[0])}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="mono-check" 
                checked={newPresetIsMonoCheck}
                onCheckedChange={setNewPresetIsMonoCheck}
              />
              <Label htmlFor="mono-check">Check mono compatibility</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is-public" 
                checked={newPresetIsPublic}
                onCheckedChange={setNewPresetIsPublic}
              />
              <Label htmlFor="is-public">Make preset public</Label>
            </div>
            
            <Button onClick={handleCreatePreset}>
              <Save className="h-4 w-4 mr-1" />
              Save Preset
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {presets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No presets available. Create your first preset!
              </div>
            ) : (
              <div className="space-y-2">
                {presets.map((preset) => (
                  <div 
                    key={preset.id} 
                    className={`p-3 rounded-md border cursor-pointer flex justify-between items-center ${
                      selectedPreset?.id === preset.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPreset(preset)}
                  >
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-sm text-gray-500">
                        Target: {preset.target} LUFS (±{preset.tolerance}dB)
                      </div>
                      {preset.isPublic && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Public
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      {!preset.isPublic && session?.user?.id === preset.createdBy && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSharePreset(preset);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      )}
                      {session?.user?.id === preset.createdBy && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePreset(preset);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
