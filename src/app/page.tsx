"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import VideoUploader from "@/components/VideoUploader";
import LufsMeter from "@/components/LufsMeter";
import PresetManager from "@/components/PresetManager";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="notion-container">
            <h1 className="text-3xl font-bold mb-6 notion-heading">Audio Loudness Analyzer</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <VideoUploader />
                <LufsMeter />
              </div>
              <div>
                <PresetManager />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
