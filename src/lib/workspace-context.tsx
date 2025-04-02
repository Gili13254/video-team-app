import { createContext, useContext, useState, ReactNode } from 'react';

// Define the Workspace type
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Block type
export interface Block {
  id: string;
  workspaceId: string;
  type: string;
  config: any;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the WorkspaceUser type
export interface WorkspaceUser {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  createdAt: Date;
}

// Define the context type
interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  blocks: Block[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  setBlocks: (blocks: Block[]) => void;
  addBlock: (block: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, positionX: number, positionY: number) => void;
  resizeBlock: (id: string, width: number, height: number) => void;
}

// Create the context
const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Create the provider component
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Add a new block
  const addBlock = (block: Omit<Block, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBlock: Block = {
      ...block,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBlocks([...blocks, newBlock]);
  };

  // Update an existing block
  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id
          ? { ...block, ...updates, updatedAt: new Date() }
          : block
      )
    );
  };

  // Remove a block
  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  // Move a block
  const moveBlock = (id: string, positionX: number, positionY: number) => {
    updateBlock(id, { positionX, positionY });
  };

  // Resize a block
  const resizeBlock = (id: string, width: number, height: number) => {
    updateBlock(id, { width, height });
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        blocks,
        setWorkspaces,
        setCurrentWorkspace,
        setBlocks,
        addBlock,
        updateBlock,
        removeBlock,
        moveBlock,
        resizeBlock,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

// Create a hook to use the context
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
