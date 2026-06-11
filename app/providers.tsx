"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
    </AuthProvider>
  );
}
