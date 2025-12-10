import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingDown, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTurno } from '@/contexts/TurnoContext';
import { toast } from 'sonner';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

const categoriaColors: Record<string, string> = {
  Combustível: 'bg-orange-500/20 text-orange-400',
  Manutenção: 'bg-yellow-500/20 text-yellow-400',
  Óleo: 'bg-blue-500/20 text-blue-400',
  Imprevistos: 'bg-purple-500/20 text-purple-400',
  Multa: 'bg-destructive/20 text-destructive',
  Outros: 'bg-secondary text-muted-foreground',
};

export default function Gastos() {
  const { gastos, excluirGasto } = useTurno();
  const [search, setSearch] = useState('');

  const filteredGastos = gastos
    .filter(g => 
      g.categoria.toLowerCase().includes(search.toLowerCase()) ||
      g.descricao.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const totalGastos = filteredGastos.reduce((acc, g) => acc + g.valor, 0);

  const handleDelete = async (id: string) => {
    await excluirGasto(id);
    toast.success('Gasto excluído com sucesso');
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
            <h1 className="text-2xl lg:text-3xl font-display font-bold">Gastos</h1>
            <p className="text-muted-foreground mt-1">
              Total: <span className="text-destructive font-semibold">{formatCurrency(totalGastos)}</span>
            </p>
          </div>
          <Button variant="gradient" asChild>
            <Link to="/gastos/novo">
              <Plus className="w-5 h-5 mr-2" />
              Novo gasto
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por categoria ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredGastos.length === 0 ? (
            <div className="text-center py-12">
              <TrendingDown className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum gasto registrado</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/gastos/novo">Registrar primeiro gasto</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGastos.map((gasto) => (
                    <TableRow key={gasto.id}>
                      <TableCell className="font-medium">
                        {format(new Date(gasto.data), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-destructive font-semibold">
                        {formatCurrency(gasto.valor)}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoriaColors[gasto.categoria] || 'bg-secondary'}`}>
                          {gasto.categoria}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {gasto.descricao}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(gasto.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
