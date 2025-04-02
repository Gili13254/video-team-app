"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserProfile from "@/components/UserProfile";
import { Home, Settings, FileVideo, Sliders } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Link href="/" className="font-semibold text-xl flex items-center">
            <FileVideo className="h-5 w-5 mr-2 text-blue-500" />
            <span>VideoEditor</span>
          </Link>
          
          <nav className="hidden md:flex items-center ml-6 space-x-1">
            <Button variant="ghost" size="sm" asChild className="notion-nav-item">
              <Link href="/" className="flex items-center">
                <Home className="h-4 w-4 mr-1 notion-icon" />
                <span>Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="notion-nav-item">
              <Link href="/presets" className="flex items-center">
                <Sliders className="h-4 w-4 mr-1 notion-icon" />
                <span>Presets</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="notion-nav-item">
              <Link href="/settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-1 notion-icon" />
                <span>Settings</span>
              </Link>
            </Button>
          </nav>
        </div>
        
        <UserProfile />
      </div>
    </header>
  );
}
