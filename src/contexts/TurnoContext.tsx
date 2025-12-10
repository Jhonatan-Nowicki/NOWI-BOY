import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Turno, Ganho, Gasto, TurnoAtual } from '@/types';
import { useAuth } from './AuthContext';

interface TurnoContextType {
  turnoAtual: TurnoAtual;
  turnos: Turno[];
  ganhos: Ganho[];
  gastos: Gasto[];
  isLoading: boolean;
  iniciarTurno: (tipoTurno?: string) => Promise<void>;
  encerrarTurno: () => Promise<void>;
  adicionarGanho: (ganho: Omit<Ganho, 'id' | 'usuario_id' | 'turno_id' | 'criado_em'>) => Promise<void>;
  adicionarGasto: (gasto: Omit<Gasto, 'id' | 'usuario_id' | 'turno_id' | 'criado_em'>) => Promise<void>;
  excluirGanho: (id: string) => Promise<void>;
  excluirGasto: (id: string) => Promise<void>;
  getGanhosPorTurno: (turnoId: string) => Ganho[];
  getGastosPorTurno: (turnoId: string) => Gasto[];
  getResumoMensal: () => { ganhos: number; gastos: number; lucro: number };
}

const TurnoContext = createContext<TurnoContextType | undefined>(undefined);

export function TurnoProvider({ children }: { children: ReactNode }) {
  const { usuario, isAuthenticated } = useAuth();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [ganhos, setGanhos] = useState<Ganho[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    if (isAuthenticated && usuario) {
      const storedTurnos = localStorage.getItem(`nowiboy_turnos_${usuario.id}`);
      const storedGanhos = localStorage.getItem(`nowiboy_ganhos_${usuario.id}`);
      const storedGastos = localStorage.getItem(`nowiboy_gastos_${usuario.id}`);
      
      if (storedTurnos) setTurnos(JSON.parse(storedTurnos));
      if (storedGanhos) setGanhos(JSON.parse(storedGanhos));
      if (storedGastos) setGastos(JSON.parse(storedGastos));
    }
  }, [isAuthenticated, usuario]);

  // Save to localStorage
  useEffect(() => {
    if (usuario) {
      localStorage.setItem(`nowiboy_turnos_${usuario.id}`, JSON.stringify(turnos));
    }
  }, [turnos, usuario]);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(`nowiboy_ganhos_${usuario.id}`, JSON.stringify(ganhos));
    }
  }, [ganhos, usuario]);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(`nowiboy_gastos_${usuario.id}`, JSON.stringify(gastos));
    }
  }, [gastos, usuario]);

  const turnoAberto = turnos.find(t => t.status === 'aberto') || null;

  const ganhosTurnoAtual = turnoAberto 
    ? ganhos.filter(g => g.turno_id === turnoAberto.id)
    : [];
  
  const gastosTurnoAtual = turnoAberto
    ? gastos.filter(g => g.turno_id === turnoAberto.id)
    : [];

  const turnoAtual: TurnoAtual = {
    turno: turnoAberto,
    ganhos_total_turno: ganhosTurnoAtual.reduce((acc, g) => acc + g.valor, 0),
    gastos_total_turno: gastosTurnoAtual.reduce((acc, g) => acc + g.valor, 0),
    lucro_turno: ganhosTurnoAtual.reduce((acc, g) => acc + g.valor, 0) - 
                 gastosTurnoAtual.reduce((acc, g) => acc + g.valor, 0),
  };

  const iniciarTurno = async (tipoTurno?: string) => {
    if (!usuario) return;
    setIsLoading(true);
    
    const novoTurno: Turno = {
      id: Date.now().toString(),
      usuario_id: usuario.id,
      data_inicio: new Date().toISOString(),
      data_fim: null,
      status: 'aberto',
      tipo_turno: tipoTurno || null,
      ganhos_total: 0,
      gastos_total: 0,
      lucro_total: 0,
      criado_em: new Date().toISOString(),
    };
    
    setTurnos(prev => [...prev, novoTurno]);
    setIsLoading(false);
  };

  const encerrarTurno = async () => {
    if (!turnoAberto) return;
    setIsLoading(true);

    const ganhosTurno = ganhos.filter(g => g.turno_id === turnoAberto.id);
    const gastosTurno = gastos.filter(g => g.turno_id === turnoAberto.id);
    
    const totalGanhos = ganhosTurno.reduce((acc, g) => acc + g.valor, 0);
    const totalGastos = gastosTurno.reduce((acc, g) => acc + g.valor, 0);

    setTurnos(prev => prev.map(t => 
      t.id === turnoAberto.id 
        ? {
            ...t,
            status: 'fechado' as const,
            data_fim: new Date().toISOString(),
            ganhos_total: totalGanhos,
            gastos_total: totalGastos,
            lucro_total: totalGanhos - totalGastos,
          }
        : t
    ));
    
    setIsLoading(false);
  };

  const adicionarGanho = async (ganhoData: Omit<Ganho, 'id' | 'usuario_id' | 'turno_id' | 'criado_em'>) => {
    if (!usuario) return;
    
    const novoGanho: Ganho = {
      ...ganhoData,
      id: Date.now().toString(),
      usuario_id: usuario.id,
      turno_id: turnoAberto?.id || null,
      criado_em: new Date().toISOString(),
    };
    
    setGanhos(prev => [...prev, novoGanho]);
  };

  const adicionarGasto = async (gastoData: Omit<Gasto, 'id' | 'usuario_id' | 'turno_id' | 'criado_em'>) => {
    if (!usuario) return;
    
    const novoGasto: Gasto = {
      ...gastoData,
      id: Date.now().toString(),
      usuario_id: usuario.id,
      turno_id: turnoAberto?.id || null,
      criado_em: new Date().toISOString(),
    };
    
    setGastos(prev => [...prev, novoGasto]);
  };

  const excluirGanho = async (id: string) => {
    setGanhos(prev => prev.filter(g => g.id !== id));
  };

  const excluirGasto = async (id: string) => {
    setGastos(prev => prev.filter(g => g.id !== id));
  };

  const getGanhosPorTurno = (turnoId: string) => {
    return ganhos.filter(g => g.turno_id === turnoId);
  };

  const getGastosPorTurno = (turnoId: string) => {
    return gastos.filter(g => g.turno_id === turnoId);
  };

  const getResumoMensal = () => {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const ganhosMes = ganhos
      .filter(g => new Date(g.data) >= inicioMes)
      .reduce((acc, g) => acc + g.valor, 0);
    
    const gastosMes = gastos
      .filter(g => new Date(g.data) >= inicioMes)
      .reduce((acc, g) => acc + g.valor, 0);

    return {
      ganhos: ganhosMes,
      gastos: gastosMes,
      lucro: ganhosMes - gastosMes,
    };
  };

  return (
    <TurnoContext.Provider value={{
      turnoAtual,
      turnos,
      ganhos,
      gastos,
      isLoading,
      iniciarTurno,
      encerrarTurno,
      adicionarGanho,
      adicionarGasto,
      excluirGanho,
      excluirGasto,
      getGanhosPorTurno,
      getGastosPorTurno,
      getResumoMensal,
    }}>
      {children}
    </TurnoContext.Provider>
  );
}

export function useTurno() {
  const context = useContext(TurnoContext);
  if (!context) {
    throw new Error('useTurno must be used within a TurnoProvider');
  }
  return context;
}
