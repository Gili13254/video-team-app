"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVideoEditor } from "@/lib/video-editor-context";
import { isLoudnessWithinPreset } from "@/lib/audio-analyzer";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function LufsMeter() {
  const { audioAnalysisResult, selectedPreset, isAnalyzing } = useVideoEditor();

  if (isAnalyzing) {
    return (
      <Card className="w-full max-w-md mx-auto mt-4">
        <CardHeader>
          <CardTitle>Analyzing Audio</CardTitle>
          <CardDescription>
            Please wait while we analyze the audio in your video
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={45} className="w-full" />
          <p className="text-sm text-gray-500 mt-2">This may take a moment...</p>
        </CardContent>
      </Card>
    );
  }

  if (!audioAnalysisResult) {
    return null;
  }

  const { integrated, shortTerm } = audioAnalysisResult;
  
  // Calculate if values are within preset targets
  const integratedWithinTarget = selectedPreset 
    ? isLoudnessWithinPreset(integrated || 0, { target: selectedPreset.target, tolerance: selectedPreset.tolerance })
    : null;
  
  const shortTermWithinTarget = selectedPreset 
    ? isLoudnessWithinPreset(shortTerm || 0, { target: selectedPreset.target, tolerance: selectedPreset.tolerance })
    : null;

  // Calculate visual meter position (normalized between -30 and 0 LUFS)
  const normalizeValue = (value: number | null) => {
    if (value === null) return 0;
    // Clamp between -30 and 0, then normalize to 0-100
    const clamped = Math.max(-30, Math.min(0, value));
    return ((clamped + 30) / 30) * 100;
  };

  const integratedPosition = normalizeValue(integrated);
  const shortTermPosition = normalizeValue(shortTerm);

  return (
    <Card className="notion-card w-full mt-4">
      <CardHeader>
        <CardTitle className="notion-heading">LUFS Meter Results</CardTitle>
        <CardDescription className="notion-text">
          Audio loudness measurements for your video
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Integrated LUFS */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium">Integrated LUFS</h3>
            <div className="flex items-center">
              {integratedWithinTarget !== null && (
                integratedWithinTarget ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                )
              )}
              <span className="text-sm font-mono">
                {integrated !== null ? integrated.toFixed(1) : 'N/A'} LUFS
              </span>
            </div>
          </div>
          
          <div className="h-6 bg-gray-100 rounded-full relative">
            <div 
              className="absolute h-full bg-blue-500 rounded-full"
              style={{ width: `${integratedPosition}%` }}
            />
            {selectedPreset && (
              <div 
                className="absolute h-full w-1 bg-green-500"
                style={{ 
                  left: `${normalizeValue(selectedPreset.target)}%`,
                  marginLeft: '-0.5px'
                }}
              />
            )}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-30</span>
            <span>-24</span>
            <span>-18</span>
            <span>-12</span>
            <span>-6</span>
            <span>0</span>
          </div>
        </div>
        
        {/* Short-term LUFS */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium">Short-term LUFS</h3>
            <div className="flex items-center">
              {shortTermWithinTarget !== null && (
                shortTermWithinTarget ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                )
              )}
              <span className="text-sm font-mono">
                {shortTerm !== null ? shortTerm.toFixed(1) : 'N/A'} LUFS
              </span>
            </div>
          </div>
          
          <div className="h-6 bg-gray-100 rounded-full relative">
            <div 
              className="absolute h-full bg-purple-500 rounded-full"
              style={{ width: `${shortTermPosition}%` }}
            />
            {selectedPreset && (
              <div 
                className="absolute h-full w-1 bg-green-500"
                style={{ 
                  left: `${normalizeValue(selectedPreset.target)}%`,
                  marginLeft: '-0.5px'
                }}
              />
            )}
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-30</span>
            <span>-24</span>
            <span>-18</span>
            <span>-12</span>
            <span>-6</span>
            <span>0</span>
          </div>
        </div>
        
        {/* Target information */}
        {selectedPreset ? (
          <div className="flex items-start text-sm bg-gray-50 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="font-medium">Target: {selectedPreset.name}</p>
              <p className="text-gray-600">
                Target LUFS: {selectedPreset.target} ± {selectedPreset.tolerance}
              </p>
              {!integratedWithinTarget && integrated !== null && (
                <p className="text-red-600 mt-1">
                  Integrated LUFS is {Math.abs(integrated - selectedPreset.target).toFixed(1)} LUFS 
                  {integrated < selectedPreset.target ? ' below' : ' above'} target.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-start text-sm bg-gray-50 p-3 rounded-md">
            <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
            <p>Select a preset to compare against target loudness standards.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
