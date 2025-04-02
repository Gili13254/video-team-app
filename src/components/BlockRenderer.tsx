"use client";

import React from 'react';
import { useWorkspace, Block } from '@/lib/workspace-context';
import LufsMeterBlock from '@/components/blocks/LufsMeterBlock';

// This component renders the appropriate block content based on block type
export default function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case 'LUFS Meter':
      return <LufsMeterBlock />;
    case 'Waveform Generator':
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Waveform Generator block coming soon</p>
        </div>
      );
    case 'GIF Exporter':
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">GIF Exporter block coming soon</p>
        </div>
      );
    case 'Project Management':
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Project Management block coming soon</p>
        </div>
      );
    case 'Creative Board':
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Creative Board block coming soon</p>
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Unknown block type</p>
        </div>
      );
  }
}
