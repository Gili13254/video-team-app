"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Block, useWorkspace } from '@/lib/workspace-context';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, X, Maximize, Minimize } from "lucide-react";

interface BlockContainerProps {
  block: Block;
  children: React.ReactNode;
}

export default function BlockContainer({ block, children }: BlockContainerProps) {
  const { updateBlock, removeBlock, moveBlock, resizeBlock } = useWorkspace();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [originalSize, setOriginalSize] = useState({ width: block.width, height: block.height });
  const [originalPosition, setOriginalPosition] = useState({ x: block.positionX, y: block.positionY });
  const blockRef = useRef<HTMLDivElement>(null);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - block.positionX,
        y: e.clientY - block.positionY
      });
    }
  };

  // Handle mouse down for resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragOffset({
      x: e.clientX,
      y: e.clientY
    });
    setOriginalSize({
      width: block.width,
      height: block.height
    });
  };

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        moveBlock(
          block.id,
          e.clientX - dragOffset.x,
          e.clientY - dragOffset.y
        );
      } else if (isResizing) {
        const deltaX = e.clientX - dragOffset.x;
        const deltaY = e.clientY - dragOffset.y;
        resizeBlock(
          block.id,
          Math.max(200, originalSize.width + deltaX),
          Math.max(150, originalSize.height + deltaY)
        );
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, block.id, moveBlock, resizeBlock, originalSize]);

  // Toggle maximize/minimize
  const toggleMaximize = () => {
    if (!isMaximized) {
      setOriginalPosition({ x: block.positionX, y: block.positionY });
      setOriginalSize({ width: block.width, height: block.height });
      
      // Set to maximized state
      moveBlock(block.id, 0, 0);
      resizeBlock(block.id, window.innerWidth, window.innerHeight - 100);
    } else {
      // Restore original position and size
      moveBlock(block.id, originalPosition.x, originalPosition.y);
      resizeBlock(block.id, originalSize.width, originalSize.height);
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      ref={blockRef}
      className="absolute shadow-lg rounded-lg"
      style={{
        left: `${block.positionX}px`,
        top: `${block.positionY}px`,
        width: `${block.width}px`,
        height: `${block.height}px`,
        zIndex: isDragging || isResizing || isMaximized ? 10 : 1,
      }}
    >
      <Card className="w-full h-full flex flex-col overflow-hidden">
        <CardHeader 
          className="p-3 cursor-move flex flex-row items-center space-x-2 bg-gray-50"
          onMouseDown={handleMouseDown}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
          <CardTitle className="text-sm flex-grow">{block.type}</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={toggleMaximize}
            >
              {isMaximized ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
              onClick={() => removeBlock(block.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4 overflow-auto">
          {children}
        </CardContent>
        {!isMaximized && (
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResizeMouseDown}
          >
            <div className="w-0 h-0 border-t-0 border-r-4 border-b-4 border-l-0 border-gray-400"></div>
          </div>
        )}
      </Card>
    </div>
  );
}
