export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      leads: {
        Row: {
          additional_notes: string | null
          business_type: string
          city_state: string
          company: string
          created_at: string
          description: string | null
          devices: string[] | null
          email: string
          features: string[] | null
          id: string
          integrations: string[] | null
          login_profiles: string[] | null
          name: string
          needs_login: string
          needs_reports: string
          objectives: string[] | null
          priority: string
          report_types: string[] | null
          status: string
          updated_at: string
          users_who_use: string
          whatsapp: string
        }
        Insert: {
          additional_notes?: string | null
          business_type: string
          city_state: string
          company: string
          created_at?: string
          description?: string | null
          devices?: string[] | null
          email: string
          features?: string[] | null
          id?: string
          integrations?: string[] | null
          login_profiles?: string[] | null
          name: string
          needs_login?: string
          needs_reports?: string
          objectives?: string[] | null
          priority?: string
          report_types?: string[] | null
          status?: string
          updated_at?: string
          users_who_use?: string
          whatsapp: string
        }
        Update: {
          additional_notes?: string | null
          business_type?: string
          city_state?: string
          company?: string
          created_at?: string
          description?: string | null
          devices?: string[] | null
          email?: string
          features?: string[] | null
          id?: string
          integrations?: string[] | null
          login_profiles?: string[] | null
          name?: string
          needs_login?: string
          needs_reports?: string
          objectives?: string[] | null
          priority?: string
          report_types?: string[] | null
          status?: string
          updated_at?: string
          users_who_use?: string
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_lead_duplicate: {
        Args: { _email: string; _whatsapp_digits: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
