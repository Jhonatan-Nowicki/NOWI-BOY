import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTurno } from '@/contexts/TurnoContext';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function ResumoChart() {
  const { ganhos, gastos } = useTurno();

  // Generate last 7 days data
  const data = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const ganhosDay = ganhos
      .filter(g => {
        const d = new Date(g.data);
        return d >= dayStart && d <= dayEnd;
      })
      .reduce((acc, g) => acc + g.valor, 0);

    const gastosDay = gastos
      .filter(g => {
        const d = new Date(g.data);
        return d >= dayStart && d <= dayEnd;
      })
      .reduce((acc, g) => acc + g.valor, 0);

    return {
      data: format(date, 'EEE', { locale: ptBR }),
      dataFull: format(date, 'dd/MM', { locale: ptBR }),
      ganhos: ganhosDay,
      gastos: gastosDay,
      lucro: ganhosDay - gastosDay,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border">
          <p className="text-sm font-medium mb-2">{payload[0]?.payload?.dataFull}</p>
          <div className="space-y-1 text-xs">
            <p className="text-success">Ganhos: {formatCurrency(payload[0]?.value || 0)}</p>
            <p className="text-destructive">Gastos: {formatCurrency(payload[1]?.value || 0)}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3 className="font-display font-semibold mb-6">Últimos 7 dias</h3>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGanhos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="data" 
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ganhos"
              stroke="hsl(142, 76%, 46%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGanhos)"
            />
            <Area
              type="monotone"
              dataKey="gastos"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGastos)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Ganhos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-xs text-muted-foreground">Gastos</span>
        </div>
      </div>
    </motion.div>
  );
}
