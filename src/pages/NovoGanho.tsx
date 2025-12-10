import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTurno } from '@/contexts/TurnoContext';
import { toast } from 'sonner';
import { Ganho } from '@/types';

const tiposTrabalho = ['Marmita', 'Pizzaria', 'App', 'Outro'] as const;
const formasPagamento = ['Pix', 'Dinheiro', 'Cartão', 'App'] as const;

export default function NovoGanho() {
  const navigate = useNavigate();
  const { adicionarGanho, turnoAtual } = useTurno();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    data: format(new Date(), 'yyyy-MM-dd'),
    valor: '',
    tipo_trabalho: '' as Ganho['tipo_trabalho'] | '',
    bairro: '',
    forma_pagamento: '' as Ganho['forma_pagamento'] | '',
    observacao: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.valor || !formData.tipo_trabalho || !formData.bairro || !formData.forma_pagamento) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      await adicionarGanho({
        data: formData.data,
        valor: parseFloat(formData.valor),
        tipo_trabalho: formData.tipo_trabalho as Ganho['tipo_trabalho'],
        bairro: formData.bairro,
        forma_pagamento: formData.forma_pagamento as Ganho['forma_pagamento'],
        observacao: formData.observacao || null,
      });
      toast.success('Ganho registrado com sucesso!');
      navigate('/ganhos');
    } catch (error) {
      toast.error('Erro ao registrar ganho');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">Registrar Ganho</h1>
            <p className="text-muted-foreground mt-1">
              Adicione um novo ganho ao seu histórico
            </p>
          </div>
        </motion.div>

        {turnoAtual.turno && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20"
          >
            <AlertCircle className="w-5 h-5 text-primary" />
            <p className="text-sm">
              Este ganho será vinculado ao <strong>turno atual</strong> em andamento.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={formData.valor}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de trabalho *</Label>
                <Select
                  value={formData.tipo_trabalho}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_trabalho: value as Ganho['tipo_trabalho'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposTrabalho.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro / Região *</Label>
                <Input
                  id="bairro"
                  type="text"
                  placeholder="Ex: Centro, Vila Madalena"
                  value={formData.bairro}
                  onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pagamento">Forma de pagamento *</Label>
                <Select
                  value={formData.forma_pagamento}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, forma_pagamento: value as Ganho['forma_pagamento'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma" />
                  </SelectTrigger>
                  <SelectContent>
                    {formasPagamento.map((forma) => (
                      <SelectItem key={forma} value={forma}>
                        {forma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observacao">Observação (opcional)</Label>
                <Textarea
                  id="observacao"
                  placeholder="Alguma observação sobre este ganho..."
                  value={formData.observacao}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacao: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="success"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar ganho
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppLayout>
  );
}
