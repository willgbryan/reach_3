export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          id: string
          payload: Json | null
          user_id: string | null
          is_newsletter: boolean | null
          cron_expression: string | null
        }
        Insert: {
          id: string
          payload?: Json | null
          user_id?: string | null
          is_newsletter?: boolean | null
          cron_expression?: string | null
        }
        Update: {
          id?: string
          payload?: Json | null
          user_id?: string | null
          is_newsletter?: boolean | null
          cron_expression?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'chats_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      newsletters: {
        Row: {
          id: string
          user_id: string
          created_at: string
          topic: string
          cron_expression: string
          report_type: string
        }
        Insert: {
          id: string
          user_id: string
          created_at?: string
          topic: string
          cron_expression: string
          report_type: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          topic?: string
          cron_expression?: string
          report_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      document_sections: {
        Row: {
          content: string | null
          created_at: string
          deleted_at: string | null
          document_set_id: string | null
          embedding: string | null
          fts: unknown | null
          id: string
          metadata: Json | null
          name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          document_set_id?: string | null
          embedding?: string | null
          fts?: unknown | null
          id?: string
          metadata?: Json | null
          name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          document_set_id?: string | null
          embedding?: string | null
          fts?: unknown | null
          id?: string
          metadata?: Json | null
          name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'document_sections_document_set_id_fkey'
            columns: ['document_set_id']
            isOneToOne: false
            referencedRelation: 'document_set'
            referencedColumns: ['id']
          },
        ]
      }
      document_set: {
        Row: {
          created_at: string
          description: string | null
          id: string
          private: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          private?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          private?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'document_set_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          created: string
          currency: string | null
          description: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          created?: string
          currency?: string | null
          description?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number | null
          created?: string
          currency?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'payments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      source_chat_map: {
        Row: {
          chat_id: string | null
          created_at: string | null
          mapping_id: string
          messageindex: string | null
          source_id: string | null
        }
        Insert: {
          chat_id?: string | null
          created_at?: string | null
          mapping_id: string
          messageindex?: string | null
          source_id?: string | null
        }
        Update: {
          chat_id?: string | null
          created_at?: string | null
          mapping_id?: string
          messageindex?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'source_chat_map_chat_id_fkey'
            columns: ['chat_id']
            isOneToOne: false
            referencedRelation: 'chats'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'source_chat_map_source_id_fkey'
            columns: ['source_id']
            isOneToOne: false
            referencedRelation: 'sources'
            referencedColumns: ['id']
          },
        ]
      }
      sources: {
        Row: {
          content: Json | null
          created_at: string | null
          document_hash: string
          id: string
          metadata: Json | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          document_hash: string
          id: string
          metadata?: Json | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          document_hash?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      append_chat_message: {
        Args: {
          chat_id: string
          new_message: Json
        }
        Returns: undefined
      }
      append_chat_messages: {
        Args: {
          chat_id: string
          new_messages: Json
        }
        Returns: undefined
      }
      get_user_id_by_email: {
        Args: {
          user_email: string
        }
        Returns: string
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          embedding: Json
          similarity: number
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never
