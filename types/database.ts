export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      countries: {
        Row: {
          code: string
          created_at: string
          dominant_payment_methods: string[] | null
          fatf_status: string
          id: string
          is_sanctioned: boolean
          name: string
          name_ru: string | null
          notes: string | null
          region: string
          sanction_details: string | null
        }
        Insert: {
          code: string
          created_at?: string
          dominant_payment_methods?: string[] | null
          fatf_status?: string
          id?: string
          is_sanctioned?: boolean
          name: string
          name_ru?: string | null
          notes?: string | null
          region: string
          sanction_details?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          dominant_payment_methods?: string[] | null
          fatf_status?: string
          id?: string
          is_sanctioned?: boolean
          name?: string
          name_ru?: string | null
          notes?: string | null
          region?: string
          sanction_details?: string | null
        }
        Relationships: []
      }
      data_change_log: {
        Row: {
          change_type: string
          confirmed_by: string | null
          created_at: string
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          processor_id: string | null
          source: string
          table_name: string
        }
        Insert: {
          change_type: string
          confirmed_by?: string | null
          created_at?: string
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          processor_id?: string | null
          source: string
          table_name: string
        }
        Update: {
          change_type?: string
          confirmed_by?: string | null
          created_at?: string
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          processor_id?: string | null
          source?: string
          table_name?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          icon_url: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          created_at?: string
          icon_url?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      preset_processors: {
        Row: {
          notes: string | null
          preset_id: string
          processor_id: string
          role: string
          sort_order: number
        }
        Insert: {
          notes?: string | null
          preset_id: string
          processor_id: string
          role: string
          sort_order?: number
        }
        Update: {
          notes?: string | null
          preset_id?: string
          processor_id?: string
          role?: string
          sort_order?: number
        }
        Relationships: []
      }
      presets: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_featured: boolean
          name: string
          segment_id: string | null
          slug: string
          target_region: string | null
          vertical_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          name: string
          segment_id?: string | null
          slug: string
          target_region?: string | null
          vertical_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          name?: string
          segment_id?: string | null
          slug?: string
          target_region?: string | null
          vertical_id?: string | null
        }
        Relationships: []
      }
      processor_countries: {
        Row: {
          country_id: string
          is_supported: boolean
          notes: string | null
          processor_id: string
          role: string
        }
        Insert: {
          country_id: string
          is_supported?: boolean
          notes?: string | null
          processor_id: string
          role: string
        }
        Update: {
          country_id?: string
          is_supported?: boolean
          notes?: string | null
          processor_id?: string
          role?: string
        }
        Relationships: []
      }
      processor_payment_methods: {
        Row: {
          payment_method_id: string
          processor_id: string
        }
        Insert: {
          payment_method_id: string
          processor_id: string
        }
        Update: {
          payment_method_id?: string
          processor_id?: string
        }
        Relationships: []
      }
      processor_verticals: {
        Row: {
          approval_likelihood: string
          notes: string | null
          processor_id: string
          vertical_id: string
        }
        Insert: {
          approval_likelihood?: string
          notes?: string | null
          processor_id: string
          vertical_id: string
        }
        Update: {
          approval_likelihood?: string
          notes?: string | null
          processor_id?: string
          vertical_id?: string
        }
        Relationships: []
      }
      processors: {
        Row: {
          api_quality_score: number | null
          created_at: string
          description: string | null
          id: string
          is_featured: boolean
          is_verified: boolean
          kyc_level: string
          last_scraped_at: string | null
          last_verified_at: string | null
          logo_url: string | null
          name: string
          onboarding_days_max: number | null
          onboarding_days_min: number | null
          page_hash: string | null
          scraper_url: string | null
          segment_id: string
          slug: string
          status: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          api_quality_score?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          is_verified?: boolean
          kyc_level?: string
          last_scraped_at?: string | null
          last_verified_at?: string | null
          logo_url?: string | null
          name: string
          onboarding_days_max?: number | null
          onboarding_days_min?: number | null
          page_hash?: string | null
          scraper_url?: string | null
          segment_id: string
          slug: string
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          api_quality_score?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          is_verified?: boolean
          kyc_level?: string
          last_scraped_at?: string | null
          last_verified_at?: string | null
          logo_url?: string | null
          name?: string
          onboarding_days_max?: number | null
          onboarding_days_min?: number | null
          page_hash?: string | null
          scraper_url?: string | null
          segment_id?: string
          slug?: string
          status?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          is_verified: boolean
          segment_preference: string | null
          tos_accepted_at: string | null
          verification_method: string | null
        }
        Insert: {
          created_at?: string
          id: string
          is_verified?: boolean
          segment_preference?: string | null
          tos_accepted_at?: string | null
          verification_method?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_verified?: boolean
          segment_preference?: string | null
          tos_accepted_at?: string | null
          verification_method?: string | null
        }
        Relationships: []
      }
      provider_applications: {
        Row: {
          company_name: string
          contact_email: string
          contact_name: string | null
          contact_telegram: string | null
          converted_to_processor_id: string | null
          created_at: string
          description: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          segment_slug: string | null
          status: string
          website_url: string
        }
        Insert: {
          company_name: string
          contact_email: string
          contact_name?: string | null
          contact_telegram?: string | null
          converted_to_processor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          segment_slug?: string | null
          status?: string
          website_url: string
        }
        Update: {
          company_name?: string
          contact_email?: string
          contact_name?: string | null
          contact_telegram?: string | null
          converted_to_processor_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          segment_slug?: string | null
          status?: string
          website_url?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string | null
          cons: string | null
          created_at: string
          helpful_count: number
          id: string
          is_verified: boolean
          moderation_notes: string | null
          moderation_status: string
          processor_id: string
          pros: string | null
          rating: number
          updated_at: string
          use_case: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          cons?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          is_verified?: boolean
          moderation_notes?: string | null
          moderation_status?: string
          processor_id: string
          pros?: string | null
          rating: number
          updated_at?: string
          use_case?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          cons?: string | null
          created_at?: string
          helpful_count?: number
          id?: string
          is_verified?: boolean
          moderation_notes?: string | null
          moderation_status?: string
          processor_id?: string
          pros?: string | null
          rating?: number
          updated_at?: string
          use_case?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_cascades: {
        Row: {
          created_at: string
          id: string
          monthly_volume_usd: number | null
          name: string
          steps: Json
          target_country_id: string | null
          updated_at: string
          user_id: string
          vertical_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          monthly_volume_usd?: number | null
          name: string
          steps: Json
          target_country_id?: string | null
          updated_at?: string
          user_id: string
          vertical_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          monthly_volume_usd?: number | null
          name?: string
          steps?: Json
          target_country_id?: string | null
          updated_at?: string
          user_id?: string
          vertical_id?: string | null
        }
        Relationships: []
      }
      scraper_jobs: {
        Row: {
          changes_detected: boolean
          created_at: string
          error_message: string | null
          id: string
          last_run_at: string | null
          last_success_at: string | null
          next_run_at: string | null
          page_hash_after: string | null
          page_hash_before: string | null
          processor_id: string
          raw_content: string | null
          status: string
          target_url: string
        }
        Insert: {
          changes_detected?: boolean
          created_at?: string
          error_message?: string | null
          id?: string
          last_run_at?: string | null
          last_success_at?: string | null
          next_run_at?: string | null
          page_hash_after?: string | null
          page_hash_before?: string | null
          processor_id: string
          raw_content?: string | null
          status?: string
          target_url: string
        }
        Update: {
          changes_detected?: boolean
          created_at?: string
          error_message?: string | null
          id?: string
          last_run_at?: string | null
          last_success_at?: string | null
          next_run_at?: string | null
          page_hash_after?: string | null
          page_hash_before?: string | null
          processor_id?: string
          raw_content?: string | null
          status?: string
          target_url?: string
        }
        Relationships: []
      }
      segments: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          requires_tos_acceptance: boolean
          slug: string
          ui_tone: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          requires_tos_acceptance?: boolean
          slug: string
          ui_tone: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          requires_tos_acceptance?: boolean
          slug?: string
          ui_tone?: string
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          alert_types: string[]
          created_at: string
          id: string
          is_active: boolean
          last_triggered_at: string | null
          processor_id: string
          user_id: string
        }
        Insert: {
          alert_types: string[]
          created_at?: string
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          processor_id: string
          user_id: string
        }
        Update: {
          alert_types?: string[]
          created_at?: string
          id?: string
          is_active?: boolean
          last_triggered_at?: string | null
          processor_id?: string
          user_id?: string
        }
        Relationships: []
      }
      verticals: {
        Row: {
          created_at: string
          display_name: string
          id: string
          name: string
          risk_level: string
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          name: string
          risk_level: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          name?: string
          risk_level?: string
        }
        Relationships: []
      }
      volume_tiers: {
        Row: {
          chargeback_limit_percentage: number | null
          created_at: string
          fee_fixed_usd: number | null
          fee_percentage: number | null
          id: string
          monthly_volume_limit_usd: number | null
          notes: string | null
          processor_id: string
          rolling_reserve_days: number | null
          rolling_reserve_percentage: number | null
          settlement_currency: string[] | null
          settlement_days_max: number | null
          settlement_days_min: number | null
          transaction_limit_usd: number | null
          volume_max_usd: number | null
          volume_min_usd: number
        }
        Insert: {
          chargeback_limit_percentage?: number | null
          created_at?: string
          fee_fixed_usd?: number | null
          fee_percentage?: number | null
          id?: string
          monthly_volume_limit_usd?: number | null
          notes?: string | null
          processor_id: string
          rolling_reserve_days?: number | null
          rolling_reserve_percentage?: number | null
          settlement_currency?: string[] | null
          settlement_days_max?: number | null
          settlement_days_min?: number | null
          transaction_limit_usd?: number | null
          volume_max_usd?: number | null
          volume_min_usd?: number
        }
        Update: {
          chargeback_limit_percentage?: number | null
          created_at?: string
          fee_fixed_usd?: number | null
          fee_percentage?: number | null
          id?: string
          monthly_volume_limit_usd?: number | null
          notes?: string | null
          processor_id?: string
          rolling_reserve_days?: number | null
          rolling_reserve_percentage?: number | null
          settlement_currency?: string[] | null
          settlement_days_max?: number | null
          settlement_days_min?: number | null
          transaction_limit_usd?: number | null
          volume_max_usd?: number | null
          volume_min_usd?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_processors: {
        Args: {
          p_country_code: string
          p_fee_max_pct: number
          p_method_type?: string
          p_segment_slug?: string
          p_vertical_name?: string
          p_volume_usd: number
        }
        Returns: {
          api_quality_score: number
          approval_likelihood: string
          chargeback_limit_pct: number
          country_fatf_status: string
          country_is_sanctioned: boolean
          fee_fixed_usd: number
          fee_percentage: number
          is_featured: boolean
          is_verified: boolean
          kyc_level: string
          last_verified_at: string
          onboarding_days_max: number
          onboarding_days_min: number
          processor_id: string
          processor_name: string
          processor_slug: string
          rolling_reserve_days: number
          rolling_reserve_pct: number
          segment_display_name: string
          segment_slug: string
          settlement_currency: string[]
          settlement_days_max: number
          settlement_days_min: number
          website_url: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
