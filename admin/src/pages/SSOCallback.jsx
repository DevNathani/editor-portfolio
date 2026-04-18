import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { Eye, EyeOff, Lock, Mail, User, Terminal } from 'lucide-react';

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-8">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground font-mono text-sm">Establishing secure session...</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
