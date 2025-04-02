"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { VideoEditorProvider } from "@/lib/video-editor-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <VideoEditorProvider>
        {children}
      </VideoEditorProvider>
    </SessionProvider>
  );
}
