import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Trash2, Search } from 'lucide-react';
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

const formaPagamentoColors: Record<string, string> = {
  Pix: 'bg-primary/20 text-primary',
  Dinheiro: 'bg-success/20 text-success',
  Cartão: 'bg-warning/20 text-warning',
  App: 'bg-purple-500/20 text-purple-400',
};

export default function Ganhos() {
  const { ganhos, excluirGanho } = useTurno();
  const [search, setSearch] = useState('');

  const filteredGanhos = ganhos
    .filter(g => 
      g.bairro.toLowerCase().includes(search.toLowerCase()) ||
      g.tipo_trabalho.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const totalGanhos = filteredGanhos.reduce((acc, g) => acc + g.valor, 0);

  const handleDelete = async (id: string) => {
    await excluirGanho(id);
    toast.success('Ganho excluído com sucesso');
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
            <h1 className="text-2xl lg:text-3xl font-display font-bold">Ganhos</h1>
            <p className="text-muted-foreground mt-1">
              Total: <span className="text-success font-semibold">{formatCurrency(totalGanhos)}</span>
            </p>
          </div>
          <Button variant="gradient" asChild>
            <Link to="/ganhos/novo">
              <Plus className="w-5 h-5 mr-2" />
              Novo ganho
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
                placeholder="Buscar por bairro ou tipo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredGanhos.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum ganho registrado</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/ganhos/novo">Registrar primeiro ganho</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Bairro</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGanhos.map((ganho) => (
                    <TableRow key={ganho.id}>
                      <TableCell className="font-medium">
                        {format(new Date(ganho.data), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-success font-semibold">
                        {formatCurrency(ganho.valor)}
                      </TableCell>
                      <TableCell>{ganho.tipo_trabalho}</TableCell>
                      <TableCell>{ganho.bairro}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${formaPagamentoColors[ganho.forma_pagamento] || 'bg-secondary'}`}>
                          {ganho.forma_pagamento}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(ganho.id)}
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
