export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          is_admin_only: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_admin_only?: boolean | null
          setting_key: string
          setting_value?: Json
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_admin_only?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      assignment_distributions: {
        Row: {
          acknowledged_at: string | null
          admin_notes: string | null
          assigned_by_admin: string
          assigned_to_gym_id: string | null
          collection_period: unknown | null
          completed_at: string | null
          created_at: string | null
          custom_description: string | null
          custom_title: string | null
          due_date: string
          extended_due_date: string | null
          id: number
          priority_override: string | null
          reminder_sent_at: string | null
          reviewed_at: string | null
          special_instructions: string | null
          started_at: string | null
          status: string | null
          submitted_at: string | null
          template_id: number | null
          updated_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          admin_notes?: string | null
          assigned_by_admin: string
          assigned_to_gym_id?: string | null
          collection_period?: unknown | null
          completed_at?: string | null
          created_at?: string | null
          custom_description?: string | null
          custom_title?: string | null
          due_date: string
          extended_due_date?: string | null
          id?: number
          priority_override?: string | null
          reminder_sent_at?: string | null
          reviewed_at?: string | null
          special_instructions?: string | null
          started_at?: string | null
          status?: string | null
          submitted_at?: string | null
          template_id?: number | null
          updated_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          admin_notes?: string | null
          assigned_by_admin?: string
          assigned_to_gym_id?: string | null
          collection_period?: unknown | null
          completed_at?: string | null
          created_at?: string | null
          custom_description?: string | null
          custom_title?: string | null
          due_date?: string
          extended_due_date?: string | null
          id?: number
          priority_override?: string | null
          reminder_sent_at?: string | null
          reviewed_at?: string | null
          special_instructions?: string | null
          started_at?: string | null
          status?: string | null
          submitted_at?: string | null
          template_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_distributions_assigned_to_gym_id_fkey"
            columns: ["assigned_to_gym_id"]
            isOneToOne: false
            referencedRelation: "gym_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_distributions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "assignment_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_submissions: {
        Row: {
          admin_feedback: string | null
          approved_at: string | null
          approved_by_admin: string | null
          assignment_id: number | null
          created_at: string | null
          file_metadata: Json | null
          final_approval: boolean | null
          gym_id: string | null
          id: number
          quality_notes: string | null
          quality_score: number | null
          resubmission_count: number | null
          reviewed_at: string | null
          revision_notes: string | null
          revision_requested: boolean | null
          selected_formats: string[]
          submission_notes: string | null
          submission_status: string | null
          submitted_at: string | null
          technical_notes: string | null
          updated_at: string | null
          upload_progress: Json | null
          uploaded_files: Json | null
        }
        Insert: {
          admin_feedback?: string | null
          approved_at?: string | null
          approved_by_admin?: string | null
          assignment_id?: number | null
          created_at?: string | null
          file_metadata?: Json | null
          final_approval?: boolean | null
          gym_id?: string | null
          id?: number
          quality_notes?: string | null
          quality_score?: number | null
          resubmission_count?: number | null
          reviewed_at?: string | null
          revision_notes?: string | null
          revision_requested?: boolean | null
          selected_formats: string[]
          submission_notes?: string | null
          submission_status?: string | null
          submitted_at?: string | null
          technical_notes?: string | null
          updated_at?: string | null
          upload_progress?: Json | null
          uploaded_files?: Json | null
        }
        Update: {
          admin_feedback?: string | null
          approved_at?: string | null
          approved_by_admin?: string | null
          assignment_id?: number | null
          created_at?: string | null
          file_metadata?: Json | null
          final_approval?: boolean | null
          gym_id?: string | null
          id?: number
          quality_notes?: string | null
          quality_score?: number | null
          resubmission_count?: number | null
          reviewed_at?: string | null
          revision_notes?: string | null
          revision_requested?: boolean | null
          selected_formats?: string[]
          submission_notes?: string | null
          submission_status?: string | null
          submitted_at?: string | null
          technical_notes?: string | null
          updated_at?: string | null
          upload_progress?: Json | null
          uploaded_files?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignment_distributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gym_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_templates: {
        Row: {
          assignment_brief: string
          class_camp_split: Json | null
          created_at: string | null
          created_by_admin: string
          description: string
          estimated_hours: number | null
          file_requirements: Json | null
          formats_available: string[] | null
          formats_required: string[]
          id: number
          priority: string | null
          requirements_text: string
          submission_guidelines: string
          title: string
          updated_at: string | null
          upload_specifications: Json
          video_photo_split: Json | null
        }
        Insert: {
          assignment_brief: string
          class_camp_split?: Json | null
          created_at?: string | null
          created_by_admin: string
          description: string
          estimated_hours?: number | null
          file_requirements?: Json | null
          formats_available?: string[] | null
          formats_required: string[]
          id?: number
          priority?: string | null
          requirements_text: string
          submission_guidelines: string
          title: string
          updated_at?: string | null
          upload_specifications: Json
          video_photo_split?: Json | null
        }
        Update: {
          assignment_brief?: string
          class_camp_split?: Json | null
          created_at?: string | null
          created_by_admin?: string
          description?: string
          estimated_hours?: number | null
          file_requirements?: Json | null
          formats_available?: string[] | null
          formats_required?: string[]
          id?: number
          priority?: string | null
          requirements_text?: string
          submission_guidelines?: string
          title?: string
          updated_at?: string | null
          upload_specifications?: Json
          video_photo_split?: Json | null
        }
        Relationships: []
      }
      content_comments: {
        Row: {
          attachments: Json | null
          author_id: string
          author_name: string
          author_type: string
          comment_text: string
          comment_type: string | null
          created_at: string | null
          id: string
          is_internal_note: boolean | null
          is_read: boolean | null
          is_resolved: boolean | null
          parent_comment_id: string | null
          read_at: string | null
          resolved_at: string | null
          submission_id: number | null
          updated_at: string | null
          urgency: string | null
          visibility: string
        }
        Insert: {
          attachments?: Json | null
          author_id: string
          author_name: string
          author_type: string
          comment_text: string
          comment_type?: string | null
          created_at?: string | null
          id?: string
          is_internal_note?: boolean | null
          is_read?: boolean | null
          is_resolved?: boolean | null
          parent_comment_id?: string | null
          read_at?: string | null
          resolved_at?: string | null
          submission_id?: number | null
          updated_at?: string | null
          urgency?: string | null
          visibility?: string
        }
        Update: {
          attachments?: Json | null
          author_id?: string
          author_name?: string
          author_type?: string
          comment_text?: string
          comment_type?: string | null
          created_at?: string | null
          id?: string
          is_internal_note?: boolean | null
          is_read?: boolean | null
          is_resolved?: boolean | null
          parent_comment_id?: string | null
          read_at?: string | null
          resolved_at?: string | null
          submission_id?: number | null
          updated_at?: string | null
          urgency?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "content_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_comments_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "assignment_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_profiles: {
        Row: {
          active: boolean | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          gym_location: string | null
          gym_name: string
          id: string
          pin_code: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          gym_location?: string | null
          gym_name: string
          id: string
          pin_code: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          gym_location?: string | null
          gym_name?: string
          id?: string
          pin_code?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      upload_progress_tracking: {
        Row: {
          approved_count: number | null
          completion_percentage: number | null
          created_at: string | null
          file_type: string
          gym_id: string | null
          id: string
          last_upload_at: string | null
          needs_revision_count: number | null
          pending_review_count: number | null
          required_count: number
          submission_id: number | null
          updated_at: string | null
          uploaded_count: number | null
        }
        Insert: {
          approved_count?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          file_type: string
          gym_id?: string | null
          id?: string
          last_upload_at?: string | null
          needs_revision_count?: number | null
          pending_review_count?: number | null
          required_count: number
          submission_id?: number | null
          updated_at?: string | null
          uploaded_count?: number | null
        }
        Update: {
          approved_count?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          file_type?: string
          gym_id?: string | null
          id?: string
          last_upload_at?: string | null
          needs_revision_count?: number | null
          pending_review_count?: number | null
          required_count?: number
          submission_id?: number | null
          updated_at?: string | null
          uploaded_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "upload_progress_tracking_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gym_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upload_progress_tracking_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "assignment_submissions"
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
