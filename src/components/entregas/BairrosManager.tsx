import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBairros, Bairro } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

export function BairrosManager() {
  const { bairros, isLoading, addBairro, updateBairro, deleteBairro } = useBairros();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [taxa, setTaxa] = useState('');

  const handleAdd = async () => {
    if (!nome.trim() || !taxa) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    try {
      await addBairro(nome.trim(), parseFloat(taxa));
      toast.success('Bairro adicionado');
      setNome('');
      setTaxa('');
      setIsAdding(false);
    } catch (error) {
      toast.error('Erro ao adicionar bairro');
    }
  };

  const handleUpdate = async (bairro: Bairro) => {
    if (!nome.trim() || !taxa) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    try {
      await updateBairro(bairro.id, nome.trim(), parseFloat(taxa));
      toast.success('Bairro atualizado');
      setEditingId(null);
      setNome('');
      setTaxa('');
    } catch (error) {
      toast.error('Erro ao atualizar bairro');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBairro(id);
      toast.success('Bairro removido');
    } catch (error) {
      toast.error('Erro ao remover bairro');
    }
  };

  const startEdit = (bairro: Bairro) => {
    setEditingId(bairro.id);
    setNome(bairro.nome);
    setTaxa(bairro.taxa.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNome('');
    setTaxa('');
  };

  return (
    <div className="glass-card p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Bairros e Taxas</h3>
        </div>
        {!isAdding && (
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Novo
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 mb-4"
          >
            <Input
              placeholder="Nome do bairro"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Taxa R$"
              value={taxa}
              onChange={(e) => setTaxa(e.target.value)}
              className="w-24"
              step="0.50"
            />
            <Button size="icon" onClick={handleAdd}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => { setIsAdding(false); setNome(''); setTaxa(''); }}>
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="text-center py-4 text-muted-foreground">Carregando...</div>
      ) : bairros.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          Nenhum bairro cadastrado
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {bairros.map((bairro) => (
            <motion.div
              key={bairro.id}
              layout
              className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
            >
              {editingId === bairro.id ? (
                <>
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="flex-1 h-8"
                  />
                  <Input
                    type="number"
                    value={taxa}
                    onChange={(e) => setTaxa(e.target.value)}
                    className="w-20 h-8"
                    step="0.50"
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleUpdate(bairro)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium">{bairro.nome}</span>
                  <span className="text-primary font-semibold">
                    R$ {bairro.taxa.toFixed(2)}
                  </span>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(bairro)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(bairro.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
