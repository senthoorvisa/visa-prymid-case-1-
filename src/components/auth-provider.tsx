"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { demoAuthService, type DemoIdentity } from "@/lib/auth-service";

type DemoAuthContextValue = {
  user: DemoIdentity | null;
  signIn: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
};

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DemoIdentity | null>(null);
  const value = useMemo<DemoAuthContextValue>(() => ({
    user,
    signIn: async (email, password) => { setUser(await demoAuthService.signIn(email, password)); },
    continueAsGuest: async () => { setUser(await demoAuthService.continueAsGuest()); },
    signOut: async () => { await demoAuthService.signOut(); setUser(null); },
  }), [user]);

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) throw new Error("useDemoAuth must be used inside DemoAuthProvider.");
  return context;
}
