"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useVideoEditor } from "@/lib/video-editor-context";
import { analyzeAudio } from "@/lib/audio-analyzer";
import { Upload, FileVideo, AlertCircle, CheckCircle } from "lucide-react";

export default function VideoUploader() {
  const { 
    videoFile, 
    setVideoFile, 
    isAnalyzing, 
    setIsAnalyzing,
    setAudioAnalysisResult,
    selectedPreset
  } = useVideoEditor();
  
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setUploadStatus('idle');
      setErrorMessage(null);
      setAudioAnalysisResult(null);
    }
  };
  
  const handleUpload = async () => {
    if (!videoFile) return;
    
    setUploadStatus('uploading');
    
    try {
      // Upload to Supabase
      const formData = new FormData();
      formData.append('file', videoFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload video');
      }
      
      setUploadStatus('success');
      
      // Analyze audio after successful upload
      setIsAnalyzing(true);
      try {
        const result = await analyzeAudio(videoFile);
        setAudioAnalysisResult(result);
      } catch (error) {
        console.error('Error analyzing audio:', error);
        setErrorMessage('Failed to analyze audio');
      } finally {
        setIsAnalyzing(false);
      }
      
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadStatus('error');
      setErrorMessage('Failed to upload video');
    }
  };
  
  return (
    <Card className="notion-card w-full">
      <CardHeader>
        <CardTitle className="notion-heading">Upload Video</CardTitle>
        <CardDescription className="notion-text">
          Upload a video file to analyze its audio loudness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => document.getElementById('video-upload')?.click()}
          >
            {videoFile ? (
              <div className="text-center">
                <FileVideo className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium">{videoFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">
                  MP4, MOV, AVI up to 500MB
                </p>
              </div>
            )}
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          
          {errorMessage && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errorMessage}
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="flex items-center text-green-500 text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Video uploaded successfully
            </div>
          )}
          
          <Button 
            onClick={handleUpload} 
            disabled={!videoFile || uploadStatus === 'uploading' || isAnalyzing}
            className="w-full"
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
