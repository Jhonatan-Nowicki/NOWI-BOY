import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEstabelecimentos, Estabelecimento } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

export function EstabelecimentosManager() {
  const { estabelecimentos, isLoading, addEstabelecimento, updateEstabelecimento, deleteEstabelecimento } = useEstabelecimentos();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [diaria, setDiaria] = useState('');

  const handleAdd = async () => {
    if (!nome.trim() || !diaria) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    try {
      await addEstabelecimento(nome.trim(), parseFloat(diaria));
      toast.success('Estabelecimento adicionado');
      setNome('');
      setDiaria('');
      setIsAdding(false);
    } catch (error) {
      toast.error('Erro ao adicionar estabelecimento');
    }
  };

  const handleUpdate = async (estabelecimento: Estabelecimento) => {
    if (!nome.trim() || !diaria) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    try {
      await updateEstabelecimento(estabelecimento.id, nome.trim(), parseFloat(diaria));
      toast.success('Estabelecimento atualizado');
      setEditingId(null);
      setNome('');
      setDiaria('');
    } catch (error) {
      toast.error('Erro ao atualizar estabelecimento');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEstabelecimento(id);
      toast.success('Estabelecimento removido');
    } catch (error) {
      toast.error('Erro ao remover estabelecimento');
    }
  };

  const startEdit = (estabelecimento: Estabelecimento) => {
    setEditingId(estabelecimento.id);
    setNome(estabelecimento.nome);
    setDiaria(estabelecimento.diaria.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNome('');
    setDiaria('');
  };

  return (
    <div className="glass-card p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Estabelecimentos</h3>
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
              placeholder="Nome do estabelecimento"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Diária R$"
              value={diaria}
              onChange={(e) => setDiaria(e.target.value)}
              className="w-28"
              step="1"
            />
            <Button size="icon" onClick={handleAdd}>
              <Check className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => { setIsAdding(false); setNome(''); setDiaria(''); }}>
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="text-center py-4 text-muted-foreground">Carregando...</div>
      ) : estabelecimentos.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">
          Nenhum estabelecimento cadastrado
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {estabelecimentos.map((estab) => (
            <motion.div
              key={estab.id}
              layout
              className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
            >
              {editingId === estab.id ? (
                <>
                  <Input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="flex-1 h-8"
                  />
                  <Input
                    type="number"
                    value={diaria}
                    onChange={(e) => setDiaria(e.target.value)}
                    className="w-24 h-8"
                    step="1"
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleUpdate(estab)}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 font-medium">{estab.nome}</span>
                  <span className="text-green-500 font-semibold">
                    R$ {estab.diaria.toFixed(2)}/dia
                  </span>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(estab)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(estab.id)}>
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
