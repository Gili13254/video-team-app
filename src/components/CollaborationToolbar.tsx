"use client";

import React, { useState, useEffect } from 'react';
import { useWorkspace, Block } from '@/lib/workspace-context';
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, MessageSquare, Share2 } from "lucide-react";

// Mock active users data
const mockActiveUsers = [
  { id: 'user1', name: 'John Doe', email: 'john@example.com', avatar: '' },
  { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
  { id: 'user3', name: 'Bob Johnson', email: 'bob@example.com', avatar: '' },
];

// Mock comments data
const mockComments = [
  { id: 'comment1', userId: 'user1', userName: 'John Doe', text: 'This looks great!', timestamp: new Date(Date.now() - 3600000) },
  { id: 'comment2', userId: 'user2', userName: 'Jane Smith', text: 'I think we should adjust the LUFS target.', timestamp: new Date(Date.now() - 1800000) },
];

export default function CollaborationToolbar() {
  const { data: session } = useSession();
  const { currentWorkspace } = useWorkspace();
  const [activeUsers, setActiveUsers] = useState(mockActiveUsers);
  const [comments, setComments] = useState(mockComments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  // In a real implementation, this would use WebSockets to track active users
  useEffect(() => {
    // Simulate user presence updates
    const interval = setInterval(() => {
      // Randomly add or remove a user to simulate real-time updates
      if (Math.random() > 0.7) {
        const randomUser = mockActiveUsers[Math.floor(Math.random() * mockActiveUsers.length)];
        if (!activeUsers.find(user => user.id === randomUser.id)) {
          setActiveUsers([...activeUsers, randomUser]);
        } else if (activeUsers.length > 1) {
          setActiveUsers(activeUsers.filter(user => user.id !== randomUser.id));
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [activeUsers]);

  // Add a new comment
  const handleAddComment = () => {
    if (!newComment.trim() || !session?.user) return;

    const comment = {
      id: `comment${Date.now()}`,
      userId: session.user.id || 'current-user',
      userName: session.user.name || 'You',
      text: newComment,
      timestamp: new Date()
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  // Format timestamp to relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Generate share link
  const handleShareWorkspace = () => {
    if (!currentWorkspace) return;
    
    // In a real implementation, this would generate a unique sharing link
    // For now, we'll simulate copying a link to clipboard
    const shareLink = `https://video-editor-app.com/workspace/${currentWorkspace.id}`;
    navigator.clipboard.writeText(shareLink);
    
    // Show a toast notification (would be implemented in a real app)
    alert('Share link copied to clipboard!');
  };

  if (!currentWorkspace) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-between items-center z-10">
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex -space-x-2">
                {activeUsers.slice(0, 3).map((user) => (
                  <Avatar key={user.id} className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                {activeUsers.length > 3 && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs border-2 border-white">
                    +{activeUsers.length - 3}
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Active collaborators:</p>
              <ul className="text-xs">
                {activeUsers.map((user) => (
                  <li key={user.id}>{user.name}</li>
                ))}
              </ul>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Badge variant="outline" className="flex items-center">
          <Users className="h-3 w-3 mr-1" />
          {activeUsers.length} online
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Comments ({comments.length})
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center"
          onClick={handleShareWorkspace}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
      
      {showComments && (
        <div className="absolute bottom-full right-0 mb-2 w-80 bg-white border rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="font-medium mb-3">Comments</h3>
          
          <div className="space-y-3 mb-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <span className="text-xs text-gray-500">{formatRelativeTime(comment.timestamp)}</span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-1 border rounded-md text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button size="sm" onClick={handleAddComment}>Send</Button>
          </div>
        </div>
      )}
    </div>
  );
}
