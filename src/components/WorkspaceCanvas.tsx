"use client";

import React, { useState } from 'react';
import { useWorkspace, Block } from '@/lib/workspace-context';
import BlockContainer from '@/components/BlockContainer';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function WorkspaceCanvas() {
  const { blocks, addBlock, currentWorkspace } = useWorkspace();
  const [blockTypes] = useState([
    { type: 'LUFS Meter', description: 'Analyze audio loudness' },
    { type: 'Waveform Generator', description: 'Generate audio waveforms' },
    { type: 'GIF Exporter', description: 'Export animations as GIFs' },
    { type: 'Project Management', description: 'Track project progress' },
    { type: 'Creative Board', description: 'Collect references and ideas' }
  ]);

  // Add a new block to the workspace
  const handleAddBlock = (type: string) => {
    if (!currentWorkspace) return;
    
    // Calculate position for new block (staggered)
    const blockCount = blocks.length;
    const positionX = 50 + (blockCount % 3) * 30;
    const positionY = 100 + (blockCount % 3) * 30;
    
    addBlock({
      workspaceId: currentWorkspace.id,
      type,
      config: {},
      positionX,
      positionY,
      width: 400,
      height: 300
    });
  };

  // Render block content based on type
  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'LUFS Meter':
        return <div>LUFS Meter Content</div>;
      case 'Waveform Generator':
        return <div>Waveform Generator Content</div>;
      case 'GIF Exporter':
        return <div>GIF Exporter Content</div>;
      case 'Project Management':
        return <div>Project Management Content</div>;
      case 'Creative Board':
        return <div>Creative Board Content</div>;
      default:
        return <div>Unknown Block Type</div>;
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-semibold mb-4">No Workspace Selected</h2>
          <p className="text-gray-600 mb-6">
            Please select a workspace or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      {/* Workspace blocks */}
      {blocks.map((block) => (
        <BlockContainer key={block.id} block={block}>
          {renderBlockContent(block)}
        </BlockContainer>
      ))}

      {/* Add block button */}
      <div className="absolute bottom-6 right-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {blockTypes.map((blockType) => (
              <DropdownMenuItem 
                key={blockType.type}
                onClick={() => handleAddBlock(blockType.type)}
                className="cursor-pointer"
              >
                <div>
                  <div className="font-medium">{blockType.type}</div>
                  <div className="text-xs text-gray-500">{blockType.description}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
