import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Search, ShieldCheck, LogOut } from 'lucide-react';

export function Layout({ children }: { children: ReactNode }) {
  const { user, profile, logOut, isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Library', icon: BookOpen },
    { to: '/search', label: 'Search', icon: Search },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: ShieldCheck }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-[#222] bg-[#111]">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-white font-semibold text-lg">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              SuperPrompt
            </Link>
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label="User menu" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} />
                    <AvatarFallback className="bg-indigo-600 text-white text-xs">
                      {profile?.displayName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#111] border-[#222] text-white">
                <DropdownMenuItem className="text-gray-400 text-xs focus:bg-transparent cursor-default">
                  {profile?.email}
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem className="text-indigo-400 text-xs focus:bg-transparent cursor-default">
                    Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logOut} className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
