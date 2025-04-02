"use client";

import React, { useState } from 'react';
import { useWorkspace } from '@/lib/workspace-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Users, Folder } from "lucide-react";
import { useSession } from "next-auth/react";

export default function WorkspaceManager() {
  const { data: session } = useSession();
  const { workspaces, setWorkspaces, setCurrentWorkspace, currentWorkspace } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

  // Create a new workspace
  const handleCreateWorkspace = () => {
    if (!newWorkspaceName || !session?.user?.id) return;
    
    const newWorkspace = {
      id: crypto.randomUUID(),
      name: newWorkspaceName,
      description: newWorkspaceDescription,
      ownerId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedWorkspaces = [...workspaces, newWorkspace];
    setWorkspaces(updatedWorkspaces);
    setCurrentWorkspace(newWorkspace);
    
    // Reset form
    setNewWorkspaceName('');
    setNewWorkspaceDescription('');
    setIsCreating(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Your Workspaces</h1>
        <Button 
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? 'Cancel' : 'New Workspace'}
        </Button>
      </div>
      
      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Workspace</CardTitle>
            <CardDescription>Create a new workspace to organize your tools and projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="workspace-name" className="block text-sm font-medium mb-1">
                  Workspace Name
                </label>
                <Input
                  id="workspace-name"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="My Video Project"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="workspace-description" className="block text-sm font-medium mb-1">
                  Description (optional)
                </label>
                <Input
                  id="workspace-description"
                  value={newWorkspaceDescription}
                  onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                  placeholder="A workspace for my video editing project"
                  className="w-full"
                />
              </div>
              <Button onClick={handleCreateWorkspace} disabled={!newWorkspaceName}>
                Create Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workspaces.map((workspace) => (
          <Card 
            key={workspace.id} 
            className={`cursor-pointer transition-all ${
              currentWorkspace?.id === workspace.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
            onClick={() => setCurrentWorkspace(workspace)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Folder className="h-5 w-5 mr-2 text-blue-500" />
                {workspace.name}
              </CardTitle>
              {workspace.description && (
                <CardDescription className="mt-1">
                  {workspace.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Owner</span>
                </div>
                <div>
                  Created {new Date(workspace.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {workspaces.length === 0 && !isCreating && (
          <div className="col-span-full text-center p-12 bg-gray-50 rounded-lg">
            <Folder className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No workspaces yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first workspace to get started with your video editing projects
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Workspace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
