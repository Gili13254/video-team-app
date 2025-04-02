"use client";

import React from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import WorkspaceCanvas from '@/components/WorkspaceCanvas';
import WorkspaceManager from '@/components/WorkspaceManager';
import CollaborationManager from '@/components/CollaborationManager';
import CollaborationToolbar from '@/components/CollaborationToolbar';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WorkspacePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Tabs defaultValue="workspaces" className="flex-grow">
        <div className="container mx-auto px-4 py-2">
          <TabsList>
            <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
            <TabsTrigger value="canvas">Canvas</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="workspaces" className="flex-grow">
          <WorkspaceManager />
        </TabsContent>
        <TabsContent value="canvas" className="flex-grow">
          <WorkspaceCanvas />
        </TabsContent>
        <TabsContent value="collaborators" className="flex-grow">
          <CollaborationManager />
        </TabsContent>
      </Tabs>
      <CollaborationToolbar />
    </div>
  );
}
