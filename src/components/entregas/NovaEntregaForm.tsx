import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, DollarSign, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBairros, useEntregas } from '@/hooks/useSupabaseData';
import { useTurno } from '@/contexts/TurnoContext';
import { LeitorComanda } from './LeitorComanda';
import { toast } from 'sonner';

interface NovaEntregaFormProps {
  estabelecimentoId: string;
  diaria: number;
}

export function NovaEntregaForm({ estabelecimentoId, diaria }: NovaEntregaFormProps) {
  const { bairros } = useBairros();
  const { addEntrega } = useEntregas();
  const { turnoAtual } = useTurno();
  
  const [endereco, setEndereco] = useState('');
  const [bairroId, setBairroId] = useState('');
  const [bairroNome, setBairroNome] = useState('');
  const [taxa, setTaxa] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update taxa when bairro changes
  useEffect(() => {
    if (bairroId) {
      const bairro = bairros.find(b => b.id === bairroId);
      if (bairro) {
        setTaxa(bairro.taxa);
        setBairroNome(bairro.nome);
      }
    }
  }, [bairroId, bairros]);

  const handleDataExtracted = (data: {
    endereco: string;
    bairro: string;
    taxa: number;
    referencia: string | null;
    observacao: string | null;
  }) => {
    setEndereco(data.endereco);
    setBairroNome(data.bairro);
    setTaxa(data.taxa);
    
    // Try to find matching bairro
    const matchingBairro = bairros.find(b => 
      b.nome.toLowerCase() === data.bairro.toLowerCase()
    );
    if (matchingBairro) {
      setBairroId(matchingBairro.id);
    }
  };

  const handleBairroChange = (value: string) => {
    setBairroId(value);
  };

  const handleSubmit = async () => {
    if (!endereco.trim()) {
      toast.error('Informe o endereço');
      return;
    }
    
    if (!bairroNome.trim() && !bairroId) {
      toast.error('Selecione ou informe o bairro');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addEntrega({
        turno_id: turnoAtual.turno?.id || null,
        estabelecimento_id: estabelecimentoId || null,
        bairro_id: bairroId || null,
        endereco: endereco.trim(),
        bairro_nome: bairroNome || bairros.find(b => b.id === bairroId)?.nome || null,
        taxa,
        referencia: null,
        observacao: null,
      });
      
      toast.success('Entrega registrada!');
      
      // Reset form
      setEndereco('');
      setBairroId('');
      setBairroNome('');
      setTaxa(0);
      
    } catch (error) {
      toast.error('Erro ao registrar entrega');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Diária Display */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Diária do turno</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-500">
              R$ {diaria.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Leitor de Comanda */}
      <LeitorComanda bairros={bairros} onDataExtracted={handleDataExtracted} />

      {/* Manual Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 lg:p-6 space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold">Dados da Entrega</h3>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-1 block">Endereço *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, complemento"
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Bairro *</label>
            <Select value={bairroId} onValueChange={handleBairroChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {bairros.map((bairro) => (
                  <SelectItem key={bairro.id} value={bairro.id}>
                    {bairro.nome} - R$ {bairro.taxa.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!bairroId && (
              <Input
                value={bairroNome}
                onChange={(e) => setBairroNome(e.target.value)}
                placeholder="Ou digite o bairro"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Taxa</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                value={taxa}
                onChange={(e) => setTaxa(parseFloat(e.target.value) || 0)}
                className="pl-10"
                step="0.50"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground">Taxa da entrega</p>
            <p className="text-2xl font-bold text-primary">R$ {taxa.toFixed(2)}</p>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-gradient"
          >
            <Check className="w-4 h-4 mr-2" />
            Registrar Entrega
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
