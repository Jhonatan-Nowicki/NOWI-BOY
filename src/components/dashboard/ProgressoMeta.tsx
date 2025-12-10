import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTurno } from '@/contexts/TurnoContext';
import { Progress } from '@/components/ui/progress';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function ProgressoMeta() {
  const { usuario } = useAuth();
  const { getResumoMensal } = useTurno();
  const resumo = getResumoMensal();
  
  const meta = usuario?.meta_mensal_lucro || 0;
  const progresso = meta > 0 ? Math.min((resumo.lucro / meta) * 100, 100) : 0;

  if (!meta) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-warning/20">
            <Target className="w-5 h-5 text-warning" />
          </div>
          <h3 className="font-display font-semibold">Meta mensal</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Defina uma meta mensal no seu perfil para acompanhar seu progresso.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-display font-semibold">Meta mensal</h3>
        </div>
        <span className="text-2xl font-display font-bold text-primary">
          {progresso.toFixed(0)}%
        </span>
      </div>

      <Progress value={progresso} className="h-3 mb-4" />

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Lucro atual: <strong className="text-foreground">{formatCurrency(resumo.lucro)}</strong>
        </span>
        <span className="text-muted-foreground">
          Meta: <strong className="text-foreground">{formatCurrency(meta)}</strong>
        </span>
      </div>
    </motion.div>
  );
}
