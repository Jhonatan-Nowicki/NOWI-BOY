import { motion } from 'framer-motion';
import { Play, Square, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTurno } from '@/contexts/TurnoContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function TurnoCard() {
  const { turnoAtual, iniciarTurno, encerrarTurno, isLoading } = useTurno();
  const navigate = useNavigate();

  if (!turnoAtual.turno) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <Play className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-3">
          Você ainda não iniciou seu dia
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Clique em <strong>Iniciar dia</strong> para começar a registrar seus ganhos 
          e gastos deste turno. Acompanhe tudo em tempo real.
        </p>
        <Button
          variant="gradient"
          size="xl"
          onClick={() => iniciarTurno()}
          disabled={isLoading}
          className="min-w-[200px]"
        >
          <Play className="w-5 h-5 mr-2" />
          Iniciar dia
        </Button>
      </motion.div>
    );
  }

  const { turno, ganhos_total_turno, gastos_total_turno, lucro_turno } = turnoAtual;
  const tempoDecorrido = formatDistanceToNow(new Date(turno.data_inicio), {
    locale: ptBR,
    addSuffix: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
          <h2 className="text-xl font-display font-bold">Turno em andamento</h2>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{tempoDecorrido}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-success/10 rounded-xl p-4 border border-success/20">
          <div className="flex items-center gap-2 text-success mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Ganhos</span>
          </div>
          <p className="text-2xl font-display font-bold text-success">
            {formatCurrency(ganhos_total_turno)}
          </p>
        </div>

        <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-medium">Gastos</span>
          </div>
          <p className="text-2xl font-display font-bold text-destructive">
            {formatCurrency(gastos_total_turno)}
          </p>
        </div>

        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
          <div className="flex items-center gap-2 text-primary mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Lucro</span>
          </div>
          <p className="text-2xl font-display font-bold text-primary">
            {formatCurrency(lucro_turno)}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="success"
          size="lg"
          onClick={() => navigate('/ganhos/novo')}
          className="flex-1"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Registrar ganho
        </Button>
        <Button
          variant="destructive"
          size="lg"
          onClick={() => navigate('/gastos/novo')}
          className="flex-1"
        >
          <TrendingDown className="w-5 h-5 mr-2" />
          Registrar gasto
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={encerrarTurno}
          disabled={isLoading}
          className="flex-1"
        >
          <Square className="w-5 h-5 mr-2" />
          Encerrar turno
        </Button>
      </div>
    </motion.div>
  );
}
