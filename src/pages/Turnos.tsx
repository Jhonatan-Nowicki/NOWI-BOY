import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronDown, ChevronUp, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { format, formatDistanceStrict } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useTurno } from '@/contexts/TurnoContext';
import { Turno } from '@/types';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function TurnoItem({ turno }: { turno: Turno }) {
  const [isOpen, setIsOpen] = useState(false);
  const { getGanhosPorTurno, getGastosPorTurno } = useTurno();
  
  const ganhosTurno = getGanhosPorTurno(turno.id);
  const gastosTurno = getGastosPorTurno(turno.id);

  const duracao = turno.data_fim 
    ? formatDistanceStrict(new Date(turno.data_inicio), new Date(turno.data_fim), { locale: ptBR })
    : 'Em andamento';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${turno.status === 'aberto' ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
          <div className="text-left">
            <p className="font-semibold">
              {format(new Date(turno.data_inicio), "dd 'de' MMMM", { locale: ptBR })}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(turno.data_inicio), 'HH:mm', { locale: ptBR })}
              {turno.data_fim && ` - ${format(new Date(turno.data_fim), 'HH:mm', { locale: ptBR })}`}
              {' • '}{duracao}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className={`font-bold ${turno.lucro_total >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(turno.lucro_total)}
            </p>
            <p className="text-xs text-muted-foreground">Lucro</p>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border"
        >
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-success/10">
                <TrendingUp className="w-5 h-5 mx-auto text-success mb-1" />
                <p className="text-lg font-bold text-success">{formatCurrency(turno.ganhos_total)}</p>
                <p className="text-xs text-muted-foreground">Ganhos</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-destructive/10">
                <TrendingDown className="w-5 h-5 mx-auto text-destructive mb-1" />
                <p className="text-lg font-bold text-destructive">{formatCurrency(turno.gastos_total)}</p>
                <p className="text-xs text-muted-foreground">Gastos</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 mx-auto text-primary mb-1" />
                <p className="text-lg font-bold text-primary">{formatCurrency(turno.lucro_total)}</p>
                <p className="text-xs text-muted-foreground">Lucro</p>
              </div>
            </div>

            {ganhosTurno.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-success">Ganhos ({ganhosTurno.length})</h4>
                <div className="space-y-2">
                  {ganhosTurno.map(g => (
                    <div key={g.id} className="flex justify-between text-sm p-2 rounded bg-secondary/30">
                      <span>{g.tipo_trabalho} - {g.bairro}</span>
                      <span className="text-success font-medium">{formatCurrency(g.valor)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gastosTurno.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-destructive">Gastos ({gastosTurno.length})</h4>
                <div className="space-y-2">
                  {gastosTurno.map(g => (
                    <div key={g.id} className="flex justify-between text-sm p-2 rounded bg-secondary/30">
                      <span>{g.categoria} - {g.descricao}</span>
                      <span className="text-destructive font-medium">{formatCurrency(g.valor)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Turnos() {
  const { turnos } = useTurno();
  
  const sortedTurnos = [...turnos].sort((a, b) => 
    new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime()
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Turnos</h1>
          <p className="text-muted-foreground mt-1">
            Histórico de todos os seus turnos de trabalho
          </p>
        </motion.div>

        {sortedTurnos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 text-center"
          >
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum turno registrado</p>
            <p className="text-sm text-muted-foreground mt-2">
              Vá ao Dashboard e clique em "Iniciar dia" para começar
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sortedTurnos.map((turno, index) => (
              <TurnoItem key={turno.id} turno={turno} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
