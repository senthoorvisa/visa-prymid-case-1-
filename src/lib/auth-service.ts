import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export interface AuthService<User> {
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
}

export type DemoIdentity = { id: "demo-user"; email: string };

export class DemoAuthService implements AuthService<DemoIdentity> {
  private currentUser: DemoIdentity | null = null;

  async signIn(email: string, password: string): Promise<DemoIdentity> {
    // DEMO ONLY: no real authentication.
    void password;
    this.currentUser = { id: "demo-user", email: email.trim() || "guest@pyramid.local" };
    return this.currentUser;
  }

  async continueAsGuest(): Promise<DemoIdentity> {
    return this.signIn("guest@pyramid.local", "");
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
  }
}

export class SupabaseAuthService implements AuthService<Session> {
  constructor(private readonly client: SupabaseClient<Database>) {}

  async signIn(email: string, password: string): Promise<Session> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.session) throw new Error("Supabase did not return a session.");
    return data.session;
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }
}

export const demoAuthService = new DemoAuthService();
