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
      addresses: {
        Row: {
          address1: string
          address2: string | null
          city: string
          company: string | null
          country: string
          created_at: string
          first_name: string | null
          id: string
          is_default: boolean
          last_name: string | null
          phone: string | null
          postal_code: string
          profile_id: string
          province: string | null
          updated_at: string
        }
        Insert: {
          address1: string
          address2?: string | null
          city: string
          company?: string | null
          country: string
          created_at?: string
          first_name?: string | null
          id?: string
          is_default?: boolean
          last_name?: string | null
          phone?: string | null
          postal_code: string
          profile_id: string
          province?: string | null
          updated_at?: string
        }
        Update: {
          address1?: string
          address2?: string | null
          city?: string
          company?: string | null
          country?: string
          created_at?: string
          first_name?: string | null
          id?: string
          is_default?: boolean
          last_name?: string | null
          phone?: string | null
          postal_code?: string
          profile_id?: string
          province?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          handle: string
          id: string
          image: string | null
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          handle: string
          id?: string
          image?: string | null
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          handle?: string
          id?: string
          image?: string | null
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          handle: string
          id: string
          image: string | null
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          handle: string
          id?: string
          image?: string | null
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          handle?: string
          id?: string
          image?: string | null
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      discounts: {
        Row: {
          applies_to: string
          code: string
          created_at: string
          description: string | null
          discount_type: string
          ends_at: string | null
          id: string
          is_active: boolean
          minimum_amount: number | null
          starts_at: string | null
          updated_at: string
          usage_count: number
          usage_limit: number | null
          value: number
        }
        Insert: {
          applies_to?: string
          code: string
          created_at?: string
          description?: string | null
          discount_type?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          minimum_amount?: number | null
          starts_at?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          value: number
        }
        Update: {
          applies_to?: string
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: string
          ends_at?: string | null
          id?: string
          is_active?: boolean
          minimum_amount?: number | null
          starts_at?: string | null
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          value?: number
        }
        Relationships: []
      }
      fulfillment_sources: {
        Row: {
          config: Json | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          source_type: Database["public"]["Enums"]["fulfillment_source_type"]
          updated_at: string
        }
        Insert: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          source_type?: Database["public"]["Enums"]["fulfillment_source_type"]
          updated_at?: string
        }
        Update: {
          config?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          source_type?: Database["public"]["Enums"]["fulfillment_source_type"]
          updated_at?: string
        }
        Relationships: []
      }
      inkthreadable_events: {
        Row: {
          created_at: string
          error: string | null
          event_type: string
          external_order_id: string | null
          id: string
          order_id: string | null
          order_number: string | null
          payload: Json
          processed: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_type: string
          external_order_id?: string | null
          id?: string
          order_id?: string | null
          order_number?: string | null
          payload: Json
          processed?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          error?: string | null
          event_type?: string
          external_order_id?: string | null
          id?: string
          order_id?: string | null
          order_number?: string | null
          payload?: Json
          processed?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inkthreadable_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          id: string
          location: string | null
          low_stock_threshold: number
          quantity: number
          reserved_quantity: number
          updated_at: string
          variant_id: string
        }
        Insert: {
          id?: string
          location?: string | null
          low_stock_threshold?: number
          quantity?: number
          reserved_quantity?: number
          updated_at?: string
          variant_id: string
        }
        Update: {
          id?: string
          location?: string | null
          low_stock_threshold?: number
          quantity?: number
          reserved_quantity?: number
          updated_at?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: true
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          fulfillment_source_id: string | null
          id: string
          image: string | null
          order_id: string
          price: number
          product_id: string | null
          quantity: number
          shipped_at: string | null
          sku: string | null
          status: string
          title: string
          total: number
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          variant_id: string | null
          variant_title: string | null
        }
        Insert: {
          created_at?: string
          fulfillment_source_id?: string | null
          id?: string
          image?: string | null
          order_id: string
          price: number
          product_id?: string | null
          quantity?: number
          shipped_at?: string | null
          sku?: string | null
          status?: string
          title: string
          total: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          variant_id?: string | null
          variant_title?: string | null
        }
        Update: {
          created_at?: string
          fulfillment_source_id?: string | null
          id?: string
          image?: string | null
          order_id?: string
          price?: number
          product_id?: string | null
          quantity?: number
          shipped_at?: string | null
          sku?: string | null
          status?: string
          title?: string
          total?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          variant_id?: string | null
          variant_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_fulfillment_source_id_fkey"
            columns: ["fulfillment_source_id"]
            isOneToOne: false
            referencedRelation: "fulfillment_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          currency: string
          discount_amount: number
          email: string
          external_order_id: string | null
          fulfillment_error: string | null
          fulfillment_status: string
          fulfillment_submitted_at: string | null
          id: string
          metadata: Json | null
          notes: string | null
          order_number: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          profile_id: string | null
          shipping_address: Json | null
          shipping_cost: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          currency?: string
          discount_amount?: number
          email: string
          external_order_id?: string | null
          fulfillment_error?: string | null
          fulfillment_status?: string
          fulfillment_submitted_at?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_number: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profile_id?: string | null
          shipping_address?: Json | null
          shipping_cost?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          currency?: string
          discount_amount?: number
          email?: string
          external_order_id?: string | null
          fulfillment_error?: string | null
          fulfillment_status?: string
          fulfillment_submitted_at?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_number?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profile_id?: string | null
          shipping_address?: Json | null
          shipping_cost?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_collections: {
        Row: {
          collection_id: string
          created_at: string
          product_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          product_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          position: number
          product_id: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          position?: number
          product_id: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          position?: number
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          barcode: string | null
          compare_at_price: number | null
          cost_per_item: number | null
          created_at: string
          design_urls: Json | null
          fulfillment_source_id: string | null
          id: string
          option1: string | null
          option2: string | null
          option3: string | null
          price: number | null
          product_id: string
          sku: string | null
          supplier_product_code: string | null
          title: string
          updated_at: string
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          barcode?: string | null
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          design_urls?: Json | null
          fulfillment_source_id?: string | null
          id?: string
          option1?: string | null
          option2?: string | null
          option3?: string | null
          price?: number | null
          product_id: string
          sku?: string | null
          supplier_product_code?: string | null
          title: string
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          barcode?: string | null
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          design_urls?: Json | null
          fulfillment_source_id?: string | null
          id?: string
          option1?: string | null
          option2?: string | null
          option3?: string | null
          price?: number | null
          product_id?: string
          sku?: string | null
          supplier_product_code?: string | null
          title?: string
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_fulfillment_source_id_fkey"
            columns: ["fulfillment_source_id"]
            isOneToOne: false
            referencedRelation: "fulfillment_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          compare_at_price: number | null
          cost_per_item: number | null
          created_at: string
          description: string | null
          description_html: string | null
          design_urls: Json | null
          fulfillment_source_id: string | null
          handle: string
          id: string
          price: number
          seo_description: string | null
          seo_title: string | null
          sku: string | null
          status: string
          supplier_product_code: string | null
          tags: string[] | null
          title: string
          updated_at: string
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          description?: string | null
          description_html?: string | null
          design_urls?: Json | null
          fulfillment_source_id?: string | null
          handle: string
          id?: string
          price: number
          seo_description?: string | null
          seo_title?: string | null
          sku?: string | null
          status?: string
          supplier_product_code?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          description?: string | null
          description_html?: string | null
          design_urls?: Json | null
          fulfillment_source_id?: string | null
          handle?: string
          id?: string
          price?: number
          seo_description?: string | null
          seo_title?: string | null
          sku?: string | null
          status?: string
          supplier_product_code?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_fulfillment_source_id_fkey"
            columns: ["fulfillment_source_id"]
            isOneToOne: false
            referencedRelation: "fulfillment_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accepts_marketing: boolean
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_admin: boolean
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          accepts_marketing?: boolean
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          is_admin?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          accepts_marketing?: boolean
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_admin?: boolean
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recently_viewed: {
        Row: {
          id: string
          product_id: string
          profile_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          product_id: string
          profile_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          profile_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recently_viewed_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recently_viewed_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_approved: boolean
          product_id: string
          profile_id: string | null
          rating: number
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          product_id: string
          profile_id?: string | null
          rating: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          product_id?: string
          profile_id?: string | null
          rating?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_profile_id_fkey"
            columns: ["profile_id"]
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
      fulfillment_source_type:
        | "own_brand"
        | "inkthreadable"
        | "amazon"
        | "third_party"
        | "dropship_supplier"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      payment_status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "partially_refunded"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      fulfillment_source_type: [
        "own_brand",
        "inkthreadable",
        "amazon",
        "third_party",
        "dropship_supplier",
      ],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      payment_status: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
    },
  },
} as const
