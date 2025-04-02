"use client";

import React, { useState } from 'react';
import { useWorkspace, WorkspaceUser } from '@/lib/workspace-context';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Users, UserPlus, MoreHorizontal, Crown, Edit, Trash } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CollaborationManager() {
  const { data: session } = useSession();
  const { currentWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('editor');
  const [collaborators, setCollaborators] = useState<WorkspaceUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<WorkspaceUser | null>(null);

  // Fetch collaborators when workspace changes
  React.useEffect(() => {
    if (currentWorkspace) {
      // In a real implementation, this would fetch from the database
      // For now, we'll use mock data
      const mockCollaborators: WorkspaceUser[] = [
        {
          workspaceId: currentWorkspace.id,
          userId: 'user1',
          role: 'owner',
          createdAt: new Date()
        },
        {
          workspaceId: currentWorkspace.id,
          userId: 'user2',
          role: 'editor',
          createdAt: new Date()
        }
      ];
      setCollaborators(mockCollaborators);
    }
  }, [currentWorkspace]);

  // Invite a new collaborator
  const handleInvite = () => {
    if (!email || !currentWorkspace) return;
    
    setIsLoading(true);
    
    // In a real implementation, this would send an invitation email
    // and create a pending invitation in the database
    
    // For now, we'll simulate adding a new collaborator
    setTimeout(() => {
      const newCollaborator: WorkspaceUser = {
        workspaceId: currentWorkspace.id,
        userId: email, // In a real app, this would be the user's ID
        role: role,
        createdAt: new Date()
      };
      
      setCollaborators([...collaborators, newCollaborator]);
      setEmail('');
      setRole('editor');
      setIsLoading(false);
      setIsOpen(false);
    }, 1000);
  };

  // Update a collaborator's role
  const handleUpdateRole = (userId: string, newRole: 'owner' | 'editor' | 'viewer') => {
    setCollaborators(
      collaborators.map((collab) =>
        collab.userId === userId
          ? { ...collab, role: newRole }
          : collab
      )
    );
  };

  // Remove a collaborator
  const handleRemoveCollaborator = (userId: string) => {
    setCollaborators(
      collaborators.filter((collab) => collab.userId !== userId)
    );
  };

  if (!currentWorkspace) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Collaborators
        </h2>
        <Button onClick={() => setIsOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Added</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborators.map((collaborator) => (
            <TableRow key={collaborator.userId}>
              <TableCell className="font-medium">{collaborator.userId}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {collaborator.role === 'owner' && (
                    <Crown className="h-4 w-4 mr-1 text-yellow-500" />
                  )}
                  <span className="capitalize">{collaborator.role}</span>
                </div>
              </TableCell>
              <TableCell>{collaborator.createdAt.toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {collaborator.role !== 'owner' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleUpdateRole(collaborator.userId, 'owner')}
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          <span>Make Owner</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateRole(collaborator.userId, 'editor')}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          <span>Make Editor</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleUpdateRole(collaborator.userId, 'viewer')}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          <span>Make Viewer</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleRemoveCollaborator(collaborator.userId)}
                          className="text-red-600"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          <span>Remove</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Collaborator</DialogTitle>
            <DialogDescription>
              Invite someone to collaborate on this workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Role
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="editor"
                    name="role"
                    value="editor"
                    checked={role === 'editor'}
                    onChange={() => setRole('editor')}
                    className="mr-2"
                  />
                  <label htmlFor="editor">Editor (can edit)</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="viewer"
                    name="role"
                    value="viewer"
                    checked={role === 'viewer'}
                    onChange={() => setRole('viewer')}
                    className="mr-2"
                  />
                  <label htmlFor="viewer">Viewer (read-only)</label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!email || isLoading}>
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
