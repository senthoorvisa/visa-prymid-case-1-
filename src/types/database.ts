export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type RightsStatus = "active" | "expiring_soon" | "expired" | "perpetual";
export type ProfileRole = "admin" | "editor" | "viewer";

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      films: Table<{ id: string; title: string; release_year: number | null; language: string | null; genre: string | null; synopsis: string | null; created_at: string; updated_at: string }, { id?: string; title: string; release_year?: number | null; language?: string | null; genre?: string | null; synopsis?: string | null }>;
      songs: Table<{ id: string; film_id: string; title: string; singer: string | null; language: string | null; genre: string | null; year: number | null; created_at: string; updated_at: string }, { id?: string; film_id: string; title: string; singer?: string | null; language?: string | null; genre?: string | null; year?: number | null }>;
      rights: Table<{ id: string; film_id: string; owner: string; territory: string; start_date: string; license_period_months: number | null; is_perpetual: boolean; created_at: string; updated_at: string }, { id?: string; film_id: string; owner: string; territory: string; start_date: string; license_period_months?: number | null; is_perpetual?: boolean }>;
      compilations: Table<{ id: string; name: string; territory: string; created_by: string | null; created_at: string }, { id?: string; name: string; territory: string; created_by?: string | null }>;
      compilation_items: Table<{ id: string; compilation_id: string; song_id: string; added_at: string; added_by: string | null }, { id?: string; compilation_id: string; song_id: string; added_by?: string | null }>;
      app_settings: Table<{ id: boolean; expiring_soon_days: number; song_reuse_cooldown_days: number; updated_at: string; updated_by: string | null }, { id?: boolean; expiring_soon_days?: number; song_reuse_cooldown_days?: number; updated_by?: string | null }>;
      profiles: Table<{ id: string; email: string | null; role: ProfileRole; created_at: string }, { id: string; email?: string | null; role?: ProfileRole }>;
      audit_log: Table<{ id: string; table_name: string; record_id: string; action: string; old_data: Json | null; new_data: Json | null; changed_by: string | null; changed_at: string }, { id?: string; table_name: string; record_id: string; action: string; old_data?: Json | null; new_data?: Json | null; changed_by?: string | null }>;
    };
    Views: {
      rights_status_view: { Row: { id: string; film_id: string; film_title: string; owner: string; territory: string; start_date: string; license_period_months: number | null; is_perpetual: boolean; expiry_date: string | null; status: RightsStatus }; Relationships: [] };
      compilation_eligibility_view: { Row: { song_id: string; song_title: string; film_id: string; film_title: string; singer: string | null; language: string | null; genre: string | null; year: number | null; territory: string; eligible: boolean; reason: string; last_used_at: string | null; rights_expiry_date: string | null; rights_status: RightsStatus | null }; Relationships: [] };
    };
    Functions: {
      save_compilation: { Args: { p_name: string; p_territory: string; p_song_ids: string[] }; Returns: string };
      current_user_role: { Args: Record<PropertyKey, never>; Returns: ProfileRole | null };
    };
    Enums: { profile_role: ProfileRole; rights_status: RightsStatus };
    CompositeTypes: { [_ in never]: never };
  };
};
