import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, FileText, Calendar } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTurno } from '@/contexts/TurnoContext';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

type Periodo = 'diario' | 'semanal' | 'mensal';

export default function Relatorios() {
  const [periodo, setPeriodo] = useState<Periodo>('semanal');
  const { ganhos, gastos, turnos } = useTurno();

  const getDateRange = () => {
    const now = new Date();
    switch (periodo) {
      case 'diario':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'semanal':
        return { start: startOfDay(subWeeks(now, 1)), end: endOfDay(now) };
      case 'mensal':
        return { start: startOfDay(subMonths(now, 1)), end: endOfDay(now) };
    }
  };

  const range = getDateRange();

  const filteredGanhos = ganhos.filter(g => 
    isWithinInterval(new Date(g.data), range)
  );
  const filteredGastos = gastos.filter(g => 
    isWithinInterval(new Date(g.data), range)
  );
  const filteredTurnos = turnos.filter(t => 
    isWithinInterval(new Date(t.data_inicio), range)
  );

  const totalGanhos = filteredGanhos.reduce((acc, g) => acc + g.valor, 0);
  const totalGastos = filteredGastos.reduce((acc, g) => acc + g.valor, 0);
  const lucroLiquido = totalGanhos - totalGastos;
  const diasTrabalhados = filteredTurnos.length;
  const mediaGanhosDia = diasTrabalhados > 0 ? totalGanhos / diasTrabalhados : 0;

  // Chart data
  const chartData = Array.from({ length: periodo === 'diario' ? 24 : periodo === 'semanal' ? 7 : 30 }, (_, i) => {
    const date = periodo === 'diario' 
      ? new Date(new Date().setHours(i, 0, 0, 0))
      : subDays(new Date(), (periodo === 'semanal' ? 6 : 29) - i);
    
    const dayGanhos = filteredGanhos
      .filter(g => {
        const gDate = new Date(g.data);
        if (periodo === 'diario') {
          return gDate.getHours() === i;
        }
        return gDate.toDateString() === date.toDateString();
      })
      .reduce((acc, g) => acc + g.valor, 0);

    const dayGastos = filteredGastos
      .filter(g => {
        const gDate = new Date(g.data);
        if (periodo === 'diario') {
          return gDate.getHours() === i;
        }
        return gDate.toDateString() === date.toDateString();
      })
      .reduce((acc, g) => acc + g.valor, 0);

    return {
      label: periodo === 'diario' ? `${i}h` : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      ganhos: dayGanhos,
      gastos: dayGastos,
    };
  });

  // Ganhos por tipo
  const ganhosPorTipo = filteredGanhos.reduce((acc, g) => {
    acc[g.tipo_trabalho] = (acc[g.tipo_trabalho] || 0) + g.valor;
    return acc;
  }, {} as Record<string, number>);

  const tipoChartData = Object.entries(ganhosPorTipo).map(([tipo, valor]) => ({
    tipo,
    valor,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-border">
          <div className="space-y-1 text-xs">
            {payload.map((p: any, i: number) => (
              <p key={i} style={{ color: p.color }}>
                {p.name}: {formatCurrency(p.value)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Análise detalhada das suas finanças
            </p>
          </div>
          <Button variant="outline" className="w-fit">
            <FileText className="w-5 h-5 mr-2" />
            Exportar PDF
          </Button>
        </motion.div>

        <Tabs value={periodo} onValueChange={(v) => setPeriodo(v as Periodo)}>
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="diario">Diário</TabsTrigger>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
            <TabsTrigger value="mensal">Mensal</TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="stat-card"
              >
                <TrendingUp className="w-5 h-5 text-success mb-2" />
                <p className="text-xs text-muted-foreground">Total Ganhos</p>
                <p className="text-xl font-bold text-success">{formatCurrency(totalGanhos)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="stat-card"
              >
                <TrendingDown className="w-5 h-5 text-destructive mb-2" />
                <p className="text-xs text-muted-foreground">Total Gastos</p>
                <p className="text-xl font-bold text-destructive">{formatCurrency(totalGastos)}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="stat-card"
              >
                <DollarSign className="w-5 h-5 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Lucro Líquido</p>
                <p className={`text-xl font-bold ${lucroLiquido >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {formatCurrency(lucroLiquido)}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="stat-card"
              >
                <Calendar className="w-5 h-5 text-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Dias Trabalhados</p>
                <p className="text-xl font-bold">{diasTrabalhados}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="stat-card col-span-2 lg:col-span-1"
              >
                <BarChart3 className="w-5 h-5 text-foreground mb-2" />
                <p className="text-xs text-muted-foreground">Média/Dia</p>
                <p className="text-xl font-bold">{formatCurrency(mediaGanhosDia)}</p>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="glass-card p-6"
              >
                <h3 className="font-display font-semibold mb-4">Ganhos x Gastos</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorGanhosReport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(142, 76%, 46%)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorGastosReport" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="label" 
                        stroke="hsl(215, 20%, 55%)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="hsl(215, 20%, 55%)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `R$${v}`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="ganhos"
                        name="Ganhos"
                        stroke="hsl(142, 76%, 46%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorGanhosReport)"
                      />
                      <Area
                        type="monotone"
                        dataKey="gastos"
                        name="Gastos"
                        stroke="hsl(0, 84%, 60%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorGastosReport)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h3 className="font-display font-semibold mb-4">Ganhos por Tipo de Trabalho</h3>
                {tipoChartData.length === 0 ? (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    Sem dados para exibir
                  </div>
                ) : (
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tipoChartData} layout="vertical">
                        <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={10} tickFormatter={(v) => `R$${v}`} />
                        <YAxis dataKey="tipo" type="category" stroke="hsl(215, 20%, 55%)" fontSize={12} width={80} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="valor" 
                          name="Valor"
                          fill="hsl(199, 100%, 50%)" 
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
}
