"use client";

import React from 'react';
import { useVideoEditor } from '@/lib/video-editor-context';
import { analyzeAudio } from '@/lib/audio-analyzer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileVideo, AlertCircle, CheckCircle } from "lucide-react";

export default function LufsMeterBlock() {
  const { 
    videoFile, 
    setVideoFile, 
    videoUrl, 
    setVideoUrl, 
    audioAnalysis, 
    setAudioAnalysis,
    selectedPreset
  } = useVideoEditor();

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setVideoFile(file);
    
    // Create a local URL for the video
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    // Analyze audio
    const analysis = await analyzeAudio(file);
    setAudioAnalysis(analysis);
  };

  // Handle drag and drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('video/')) return;
    
    setVideoFile(file);
    
    // Create a local URL for the video
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    
    // Analyze audio
    const analysis = await analyzeAudio(file);
    setAudioAnalysis(analysis);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Check if audio meets preset requirements
  const isAudioWithinPresetLimits = () => {
    if (!audioAnalysis || !selectedPreset) return null;
    
    const { integratedLoudness } = audioAnalysis;
    const { target, tolerance } = selectedPreset;
    
    const lowerLimit = target - tolerance;
    const upperLimit = target + tolerance;
    
    return integratedLoudness >= lowerLimit && integratedLoudness <= upperLimit;
  };

  const audioStatus = isAudioWithinPresetLimits();

  return (
    <div className="h-full flex flex-col">
      {!videoFile ? (
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center h-full flex flex-col items-center justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <FileVideo className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload a video file</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            Drag and drop a video file here, or click the button below to select a file
          </p>
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
            className="flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Select Video
          </Button>
          <input 
            id="file-upload" 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="mb-4 relative aspect-video bg-black rounded-lg overflow-hidden">
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">Integrated LUFS</div>
                <div className="text-2xl font-bold">
                  {audioAnalysis?.integratedLoudness.toFixed(1) || 'N/A'} LUFS
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-gray-500">Short-term LUFS</div>
                <div className="text-2xl font-bold">
                  {audioAnalysis?.shortTermLoudness.toFixed(1) || 'N/A'} LUFS
                </div>
              </CardContent>
            </Card>
          </div>
          
          {selectedPreset && (
            <Card className={`mb-4 ${
              audioStatus === true ? 'bg-green-50' : 
              audioStatus === false ? 'bg-red-50' : ''
            }`}>
              <CardContent className="p-4 flex items-center">
                {audioStatus === true ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : audioStatus === false ? (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                ) : null}
                <div>
                  <div className="font-medium">
                    {audioStatus === true ? 'Audio meets the target' : 
                     audioStatus === false ? 'Audio does not meet the target' :
                     'No preset selected'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Target: {selectedPreset.target} LUFS (±{selectedPreset.tolerance}dB)
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
            className="flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Different Video
          </Button>
          <input 
            id="file-upload" 
            type="file" 
            accept="video/*" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>
      )}
    </div>
  );
}
