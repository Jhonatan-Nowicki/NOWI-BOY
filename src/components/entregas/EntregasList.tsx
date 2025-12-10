import { motion } from 'framer-motion';
import { MapPin, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEntregas, useBairros, useEstabelecimentos } from '@/hooks/useSupabaseData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

export function EntregasList() {
  const { entregas, isLoading, deleteEntrega } = useEntregas();
  const { bairros } = useBairros();
  const { estabelecimentos } = useEstabelecimentos();

  const handleDelete = async (id: string) => {
    try {
      await deleteEntrega(id);
      toast.success('Entrega removida');
    } catch (error) {
      toast.error('Erro ao remover entrega');
    }
  };

  const getEstabelecimentoNome = (id: string | null) => {
    if (!id) return null;
    return estabelecimentos.find(e => e.id === id)?.nome;
  };

  if (isLoading) {
    return (
      <div className="glass-card p-8 text-center text-muted-foreground">
        Carregando entregas...
      </div>
    );
  }

  if (entregas.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhuma entrega registrada</p>
      </div>
    );
  }

  // Calculate totals
  const totalTaxas = entregas.reduce((acc, e) => acc + (e.taxa || 0), 0);
  const entregasHoje = entregas.filter(e => {
    const today = new Date().toDateString();
    return new Date(e.created_at).toDateString() === today;
  });
  const totalHoje = entregasHoje.reduce((acc, e) => acc + (e.taxa || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-muted-foreground">Entregas Hoje</p>
          <p className="text-2xl font-bold text-primary">{entregasHoje.length}</p>
          <p className="text-sm text-green-500">R$ {totalHoje.toFixed(2)}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Geral</p>
          <p className="text-2xl font-bold">{entregas.length}</p>
          <p className="text-sm text-muted-foreground">R$ {totalTaxas.toFixed(2)}</p>
        </div>
      </div>

      {/* Entregas List */}
      <div className="glass-card p-4 lg:p-6">
        <h3 className="font-display font-semibold mb-4">Histórico de Entregas</h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entregas.map((entrega, index) => (
            <motion.div
              key={entrega.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{entrega.endereco}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{entrega.bairro_nome}</span>
                  {getEstabelecimentoNome(entrega.estabelecimento_id) && (
                    <>
                      <span>•</span>
                      <span>{getEstabelecimentoNome(entrega.estabelecimento_id)}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(entrega.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-primary">R$ {(entrega.taxa || 0).toFixed(2)}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive mt-1"
                  onClick={() => handleDelete(entrega.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
