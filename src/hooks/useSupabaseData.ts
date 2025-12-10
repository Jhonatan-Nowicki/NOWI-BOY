import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Session } from '@supabase/supabase-js';

export interface Bairro {
  id: string;
  user_id: string;
  nome: string;
  taxa: number;
  created_at: string;
}

export interface Estabelecimento {
  id: string;
  user_id: string;
  nome: string;
  diaria: number;
  ativo: boolean;
  created_at: string;
}

export interface EntregaDB {
  id: string;
  user_id: string;
  turno_id: string | null;
  estabelecimento_id: string | null;
  bairro_id: string | null;
  endereco: string;
  bairro_nome: string | null;
  taxa: number;
  referencia: string | null;
  observacao: string | null;
  created_at: string;
}

export function useBairros() {
  const { usuario } = useAuth();
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBairros = useCallback(async () => {
    if (!usuario) return;
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('bairros')
      .select('*')
      .order('nome');
    
    if (error) {
      console.error('Error fetching bairros:', error);
    } else {
      setBairros(data || []);
    }
    setIsLoading(false);
  }, [usuario]);

  useEffect(() => {
    fetchBairros();
  }, [fetchBairros]);

  const addBairro = async (nome: string, taxa: number) => {
    if (!usuario) return;
    
    const { data, error } = await supabase
      .from('bairros')
      .insert({ user_id: usuario.id, nome, taxa })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding bairro:', error);
      throw error;
    }
    
    setBairros(prev => [...prev, data]);
    return data;
  };

  const updateBairro = async (id: string, nome: string, taxa: number) => {
    const { error } = await supabase
      .from('bairros')
      .update({ nome, taxa })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating bairro:', error);
      throw error;
    }
    
    setBairros(prev => prev.map(b => b.id === id ? { ...b, nome, taxa } : b));
  };

  const deleteBairro = async (id: string) => {
    const { error } = await supabase
      .from('bairros')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting bairro:', error);
      throw error;
    }
    
    setBairros(prev => prev.filter(b => b.id !== id));
  };

  return { bairros, isLoading, fetchBairros, addBairro, updateBairro, deleteBairro };
}

export function useEstabelecimentos() {
  const { usuario } = useAuth();
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEstabelecimentos = useCallback(async () => {
    if (!usuario) return;
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('estabelecimentos')
      .select('*')
      .order('nome');
    
    if (error) {
      console.error('Error fetching estabelecimentos:', error);
    } else {
      setEstabelecimentos(data || []);
    }
    setIsLoading(false);
  }, [usuario]);

  useEffect(() => {
    fetchEstabelecimentos();
  }, [fetchEstabelecimentos]);

  const addEstabelecimento = async (nome: string, diaria: number) => {
    if (!usuario) return;
    
    const { data, error } = await supabase
      .from('estabelecimentos')
      .insert({ user_id: usuario.id, nome, diaria })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding estabelecimento:', error);
      throw error;
    }
    
    setEstabelecimentos(prev => [...prev, data]);
    return data;
  };

  const updateEstabelecimento = async (id: string, nome: string, diaria: number) => {
    const { error } = await supabase
      .from('estabelecimentos')
      .update({ nome, diaria })
      .eq('id', id);
    
    if (error) {
      console.error('Error updating estabelecimento:', error);
      throw error;
    }
    
    setEstabelecimentos(prev => prev.map(e => e.id === id ? { ...e, nome, diaria } : e));
  };

  const deleteEstabelecimento = async (id: string) => {
    const { error } = await supabase
      .from('estabelecimentos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting estabelecimento:', error);
      throw error;
    }
    
    setEstabelecimentos(prev => prev.filter(e => e.id !== id));
  };

  return { estabelecimentos, isLoading, fetchEstabelecimentos, addEstabelecimento, updateEstabelecimento, deleteEstabelecimento };
}

export function useEntregas() {
  const { usuario } = useAuth();
  const [entregas, setEntregas] = useState<EntregaDB[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEntregas = useCallback(async () => {
    if (!usuario) return;
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('entregas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching entregas:', error);
    } else {
      setEntregas(data || []);
    }
    setIsLoading(false);
  }, [usuario]);

  useEffect(() => {
    fetchEntregas();
  }, [fetchEntregas]);

  const addEntrega = async (entrega: Omit<EntregaDB, 'id' | 'user_id' | 'created_at'>) => {
    if (!usuario) return;
    
    const { data, error } = await supabase
      .from('entregas')
      .insert({ ...entrega, user_id: usuario.id })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding entrega:', error);
      throw error;
    }
    
    setEntregas(prev => [data, ...prev]);
    return data;
  };

  const deleteEntrega = async (id: string) => {
    const { error } = await supabase
      .from('entregas')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting entrega:', error);
      throw error;
    }
    
    setEntregas(prev => prev.filter(e => e.id !== id));
  };

  return { entregas, isLoading, fetchEntregas, addEntrega, deleteEntrega };
}
