import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TurnoCard } from '@/components/dashboard/TurnoCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProgressoMeta } from '@/components/dashboard/ProgressoMeta';
import { ResumoChart } from '@/components/dashboard/ResumoChart';
import { useTurno } from '@/contexts/TurnoContext';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function Dashboard() {
  const { getResumoMensal } = useTurno();
  const resumo = getResumoMensal();

  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl lg:text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe seus ganhos e gastos em tempo real
          </p>
        </motion.div>

        {/* Turno Card */}
        <TurnoCard />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Ganhos no mês"
            value={formatCurrency(resumo.ganhos)}
            icon={<TrendingUp className="w-6 h-6" />}
            variant="success"
            delay={0.1}
          />
          <StatCard
            title="Gastos no mês"
            value={formatCurrency(resumo.gastos)}
            icon={<TrendingDown className="w-6 h-6" />}
            variant="danger"
            delay={0.15}
          />
          <StatCard
            title="Lucro no mês"
            value={formatCurrency(resumo.lucro)}
            icon={<DollarSign className="w-6 h-6" />}
            variant="primary"
            delay={0.2}
          />
          <StatCard
            title="Dias trabalhados"
            value="--"
            subtitle="Este mês"
            icon={<Calendar className="w-6 h-6" />}
            delay={0.25}
          />
        </div>

        {/* Charts and Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResumoChart />
          <ProgressoMeta />
        </div>
      </div>
    </AppLayout>
  );
}
