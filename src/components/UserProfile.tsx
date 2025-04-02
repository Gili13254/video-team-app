"use client";

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { UserCircle, LogOut } from "lucide-react";

export default function UserProfile() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }
  
  if (status === "unauthenticated") {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => signIn("google")}
        className="flex items-center space-x-2"
      >
        <UserCircle className="h-4 w-4" />
        <span>Sign In</span>
      </Button>
    );
  }
  
  return (
    <div className="flex items-center space-x-3">
      {session?.user?.image ? (
        <img 
          src={session.user.image} 
          alt={session.user.name || "User"} 
          className="h-8 w-8 rounded-full"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          {session?.user?.name?.charAt(0) || "U"}
        </div>
      )}
      
      <div className="flex flex-col">
        <span className="text-sm font-medium">{session?.user?.name}</span>
        <span className="text-xs text-gray-500">{session?.user?.email}</span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => signOut()}
        className="ml-2"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
