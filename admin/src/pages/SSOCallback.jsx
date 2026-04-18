import { useSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SSOCallbackPage() {
  // Simple redirect handler after OAuth redirect completes
  const navigate = useNavigate();
  // Clerk handles the callback automatically, just show a loading state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground font-mono text-sm">Establishing secure session...</p>
      </div>
    </div>
  );
}
