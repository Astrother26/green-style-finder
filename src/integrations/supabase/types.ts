export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          added_at: string | null
          carbon_kg: number | null
          id: string
          product_image: string | null
          product_name: string | null
          product_price: number | null
          product_sku: string | null
          quantity: number | null
          user_id: string
          water_liters: number | null
        }
        Insert: {
          added_at?: string | null
          carbon_kg?: number | null
          id?: string
          product_image?: string | null
          product_name?: string | null
          product_price?: number | null
          product_sku?: string | null
          quantity?: number | null
          user_id: string
          water_liters?: number | null
        }
        Update: {
          added_at?: string | null
          carbon_kg?: number | null
          id?: string
          product_image?: string | null
          product_name?: string | null
          product_price?: number | null
          product_sku?: string | null
          quantity?: number | null
          user_id?: string
          water_liters?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category: string | null
          condition: string | null
          created_at: string | null
          description: string | null
          id: string
          images: string[] | null
          original_price: number | null
          price: number | null
          size: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
          views: number | null
        }
        Insert: {
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          original_price?: number | null
          price?: number | null
          size?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          views?: number | null
        }
        Update: {
          category?: string | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          original_price?: number | null
          price?: number | null
          size?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          items: Json | null
          order_number: string | null
          shipping: number | null
          status: string | null
          subtotal: number | null
          tax: number | null
          total_carbon_saved: number | null
          total_price: number | null
          total_water_saved: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          items?: Json | null
          order_number?: string | null
          shipping?: number | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total_carbon_saved?: number | null
          total_price?: number | null
          total_water_saved?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          items?: Json | null
          order_number?: string | null
          shipping?: number | null
          status?: string | null
          subtotal?: number | null
          tax?: number | null
          total_carbon_saved?: number | null
          total_price?: number | null
          total_water_saved?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string | null
          carbon_kg: number | null
          category: string | null
          created_at: string | null
          energy_mj: number | null
          fabric: string | null
          fibre: string | null
          gender: string | null
          id: string
          image_path: string | null
          image_url: string | null
          match_score: number | null
          name: string
          original_price: number | null
          price: number | null
          sku: string | null
          source_url: string | null
          sustainability_grade: string | null
          sustainability_score: number | null
          water_liters: number | null
        }
        Insert: {
          brand?: string | null
          carbon_kg?: number | null
          category?: string | null
          created_at?: string | null
          energy_mj?: number | null
          fabric?: string | null
          fibre?: string | null
          gender?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          match_score?: number | null
          name: string
          original_price?: number | null
          price?: number | null
          sku?: string | null
          source_url?: string | null
          sustainability_grade?: string | null
          sustainability_score?: number | null
          water_liters?: number | null
        }
        Update: {
          brand?: string | null
          carbon_kg?: number | null
          category?: string | null
          created_at?: string | null
          energy_mj?: number | null
          fabric?: string | null
          fibre?: string | null
          gender?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          match_score?: number | null
          name?: string
          original_price?: number | null
          price?: number | null
          sku?: string | null
          source_url?: string | null
          sustainability_grade?: string | null
          sustainability_score?: number | null
          water_liters?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          achievements: string[] | null
          avatar_url: string | null
          created_at: string | null
          eco_level: number | null
          id: string
          name: string | null
          total_carbon_saved: number | null
          total_energy_saved: number | null
          total_items_listed: number | null
          total_items_purchased: number | null
          total_rentals: number | null
          total_water_saved: number | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string[] | null
          avatar_url?: string | null
          created_at?: string | null
          eco_level?: number | null
          id: string
          name?: string | null
          total_carbon_saved?: number | null
          total_energy_saved?: number | null
          total_items_listed?: number | null
          total_items_purchased?: number | null
          total_rentals?: number | null
          total_water_saved?: number | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string[] | null
          avatar_url?: string | null
          created_at?: string | null
          eco_level?: number | null
          id?: string
          name?: string | null
          total_carbon_saved?: number | null
          total_energy_saved?: number | null
          total_items_listed?: number | null
          total_items_purchased?: number | null
          total_rentals?: number | null
          total_water_saved?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rentals: {
        Row: {
          city: string | null
          created_at: string | null
          end_date: string | null
          id: string
          item_name: string
          notes: string | null
          occasion: string | null
          phone: string | null
          size: string | null
          start_date: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          item_name: string
          notes?: string | null
          occasion?: string | null
          phone?: string | null
          size?: string | null
          start_date?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          item_name?: string
          notes?: string | null
          occasion?: string | null
          phone?: string | null
          size?: string | null
          start_date?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rentals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
