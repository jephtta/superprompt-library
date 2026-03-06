import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export function LoginPage() {
  const { signIn } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-6 rounded-xl border border-[#222] bg-[#111] p-10 text-center">
        <BookOpen className="h-12 w-12 text-indigo-500" />
        <div>
          <h1 className="text-2xl font-bold text-white">SuperPrompt Library</h1>
          <p className="mt-2 text-sm text-gray-400">
            Your team's AI prompt collection. Search, copy, and use instantly.
          </p>
        </div>
        <Button
          onClick={signIn}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
