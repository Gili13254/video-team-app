"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Sign in to Video Editor</h1>
            <p className="text-gray-500 mt-2">
              Access your presets and analyze your videos
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center space-x-2 h-12"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle className="h-5 w-5" />
            <span>Sign in with Google</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
