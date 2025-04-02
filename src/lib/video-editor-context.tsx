"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Preset {
  id: string;
  name: string;
  target: number;
  tolerance: number;
  isMonoCheck: boolean;
  createdBy: string;
  isPublic: boolean;
}

interface AudioAnalysisResult {
  integrated: number | null;
  shortTerm: number | null;
  rawLog: string;
}

interface VideoEditorContextType {
  videoFile: File | null;
  setVideoFile: (file: File | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
  audioAnalysisResult: AudioAnalysisResult | null;
  setAudioAnalysisResult: (result: AudioAnalysisResult | null) => void;
  selectedPreset: Preset | null;
  setSelectedPreset: (preset: Preset | null) => void;
  presets: Preset[];
  setPresets: (presets: Preset[]) => void;
}

const VideoEditorContext = createContext<VideoEditorContextType | undefined>(undefined);

export const VideoEditorProvider = ({ children }: { children: ReactNode }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioAnalysisResult, setAudioAnalysisResult] = useState<AudioAnalysisResult | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);

  return (
    <VideoEditorContext.Provider
      value={{
        videoFile,
        setVideoFile,
        isAnalyzing,
        setIsAnalyzing,
        audioAnalysisResult,
        setAudioAnalysisResult,
        selectedPreset,
        setSelectedPreset,
        presets,
        setPresets,
      }}
    >
      {children}
    </VideoEditorContext.Provider>
  );
};

export const useVideoEditor = () => {
  const context = useContext(VideoEditorContext);
  if (context === undefined) {
    throw new Error('useVideoEditor must be used within a VideoEditorProvider');
  }
  return context;
};
