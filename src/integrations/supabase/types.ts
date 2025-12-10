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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bairros: {
        Row: {
          created_at: string
          id: string
          nome: string
          taxa: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          taxa?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          taxa?: number
          user_id?: string
        }
        Relationships: []
      }
      entregas: {
        Row: {
          bairro_id: string | null
          bairro_nome: string | null
          created_at: string
          endereco: string
          estabelecimento_id: string | null
          id: string
          observacao: string | null
          referencia: string | null
          taxa: number | null
          turno_id: string | null
          user_id: string
        }
        Insert: {
          bairro_id?: string | null
          bairro_nome?: string | null
          created_at?: string
          endereco: string
          estabelecimento_id?: string | null
          id?: string
          observacao?: string | null
          referencia?: string | null
          taxa?: number | null
          turno_id?: string | null
          user_id: string
        }
        Update: {
          bairro_id?: string | null
          bairro_nome?: string | null
          created_at?: string
          endereco?: string
          estabelecimento_id?: string | null
          id?: string
          observacao?: string | null
          referencia?: string | null
          taxa?: number | null
          turno_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregas_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_estabelecimento_id_fkey"
            columns: ["estabelecimento_id"]
            isOneToOne: false
            referencedRelation: "estabelecimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entregas_turno_id_fkey"
            columns: ["turno_id"]
            isOneToOne: false
            referencedRelation: "turnos"
            referencedColumns: ["id"]
          },
        ]
      }
      estabelecimentos: {
        Row: {
          ativo: boolean | null
          created_at: string
          diaria: number
          id: string
          nome: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          diaria?: number
          id?: string
          nome: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          diaria?: number
          id?: string
          nome?: string
          user_id?: string
        }
        Relationships: []
      }
      ganhos: {
        Row: {
          bairro: string | null
          created_at: string
          data: string
          forma_pagamento: string
          id: string
          observacao: string | null
          tipo_trabalho: string
          turno_id: string | null
          user_id: string
          valor: number
        }
        Insert: {
          bairro?: string | null
          created_at?: string
          data?: string
          forma_pagamento: string
          id?: string
          observacao?: string | null
          tipo_trabalho: string
          turno_id?: string | null
          user_id: string
          valor: number
        }
        Update: {
          bairro?: string | null
          created_at?: string
          data?: string
          forma_pagamento?: string
          id?: string
          observacao?: string | null
          tipo_trabalho?: string
          turno_id?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "ganhos_turno_id_fkey"
            columns: ["turno_id"]
            isOneToOne: false
            referencedRelation: "turnos"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos: {
        Row: {
          categoria: string
          created_at: string
          data: string
          descricao: string | null
          id: string
          turno_id: string | null
          user_id: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          turno_id?: string | null
          user_id: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          turno_id?: string | null
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "gastos_turno_id_fkey"
            columns: ["turno_id"]
            isOneToOne: false
            referencedRelation: "turnos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cidade: string | null
          created_at: string
          email: string
          id: string
          meta_mensal_lucro: number | null
          nome: string
          updated_at: string
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          email: string
          id?: string
          meta_mensal_lucro?: number | null
          nome: string
          updated_at?: string
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          cidade?: string | null
          created_at?: string
          email?: string
          id?: string
          meta_mensal_lucro?: number | null
          nome?: string
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      turnos: {
        Row: {
          created_at: string
          data_fim: string | null
          data_inicio: string
          diaria: number | null
          estabelecimento_id: string | null
          ganhos_total: number | null
          gastos_total: number | null
          id: string
          lucro_total: number | null
          status: string
          tipo_turno: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          diaria?: number | null
          estabelecimento_id?: string | null
          ganhos_total?: number | null
          gastos_total?: number | null
          id?: string
          lucro_total?: number | null
          status?: string
          tipo_turno?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data_fim?: string | null
          data_inicio?: string
          diaria?: number | null
          estabelecimento_id?: string | null
          ganhos_total?: number | null
          gastos_total?: number | null
          id?: string
          lucro_total?: number | null
          status?: string
          tipo_turno?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "turnos_estabelecimento_id_fkey"
            columns: ["estabelecimento_id"]
            isOneToOne: false
            referencedRelation: "estabelecimentos"
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
