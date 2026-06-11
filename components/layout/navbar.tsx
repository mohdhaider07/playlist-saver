"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Play, LogOut } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : "U";

  return (
    <nav className="fixed top-0 left-0 w-full h-14 glass-nav flex items-center justify-between px-6 z-50">
      <Link
        href="/"
        className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5 group"
      >
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center shadow-md shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/30">
          <Play className="size-4 fill-white text-white translate-x-[1px]" />
        </div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-primary group-hover:to-violet-400 transition-all duration-300">
          Playlist<span className="text-primary font-black">Hub</span>
        </span>
      </Link>

      <div>
        {isAuthenticated === true && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end select-none">
              <span className="text-xs font-semibold text-foreground/90 truncate max-w-[160px]">
                {user?.email}
              </span>
              <span className="text-[10px] text-primary font-semibold tracking-wider uppercase">
                Learner
              </span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary/20 border border-white/10 select-none">
              {userInitial}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 h-8 px-2.5"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        )}
        {isAuthenticated === false && (
          <div className="flex gap-2.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="h-8 px-3">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="h-8 px-3 shadow-md shadow-primary/10">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

