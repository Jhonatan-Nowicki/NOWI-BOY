import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Settings, Plus, Play, Store, Loader2, StopCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BairrosManager } from '@/components/entregas/BairrosManager';
import { EstabelecimentosManager } from '@/components/entregas/EstabelecimentosManager';
import { NovaEntregaForm } from '@/components/entregas/NovaEntregaForm';
import { EntregasList } from '@/components/entregas/EntregasList';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEstabelecimentos } from '@/hooks/useSupabaseData';
import { useTurno } from '@/contexts/TurnoContext';
import { toast } from 'sonner';

export default function Entregas() {
  const [activeTab, setActiveTab] = useState('nova');
  const [selectedEstabelecimentoId, setSelectedEstabelecimentoId] = useState('');
  const [isStartingTurno, setIsStartingTurno] = useState(false);
  
  const { estabelecimentos, isLoading: loadingEstabelecimentos } = useEstabelecimentos();
  const { turnoAtual, iniciarTurno, encerrarTurno, isLoading: turnoLoading } = useTurno();

  const turnoAberto = turnoAtual.turno !== null;
  const selectedEstabelecimento = estabelecimentos.find(e => e.id === selectedEstabelecimentoId);

  const handleIniciarTurno = async () => {
    if (!selectedEstabelecimentoId) {
      toast.error('Selecione um estabelecimento');
      return;
    }

    setIsStartingTurno(true);
    try {
      await iniciarTurno(selectedEstabelecimento?.nome);
      toast.success('Turno iniciado!');
    } catch (error) {
      toast.error('Erro ao iniciar turno');
    } finally {
      setIsStartingTurno(false);
    }
  };

  const handleEncerrarTurno = async () => {
    try {
      await encerrarTurno();
      setSelectedEstabelecimentoId('');
      toast.success('Turno encerrado!');
    } catch (error) {
      toast.error('Erro ao encerrar turno');
    }
  };

  // If no turno is open, show the "Iniciar Turno" screen
  if (!turnoAberto) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl lg:text-3xl font-display font-bold">Entregas</h1>
            <p className="text-muted-foreground mt-1">
              Inicie um turno para começar a registrar entregas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 lg:p-8"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="w-10 h-10 text-primary" />
              </div>
              
              <div>
                <h2 className="text-xl font-display font-semibold mb-2">
                  Iniciar Turno de Entregas
                </h2>
                <p className="text-muted-foreground">
                  Selecione o estabelecimento para começar suas entregas
                </p>
              </div>

              {loadingEstabelecimentos ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : estabelecimentos.length === 0 ? (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Você ainda não cadastrou nenhum estabelecimento.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('config')}
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Ir para Configurações
                  </Button>
                </div>
              ) : (
                <div className="w-full max-w-sm space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Estabelecimento</label>
                    <Select 
                      value={selectedEstabelecimentoId} 
                      onValueChange={setSelectedEstabelecimentoId}
                    >
                      <SelectTrigger className="w-full">
                        <Store className="w-4 h-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Selecione o estabelecimento" />
                      </SelectTrigger>
                      <SelectContent>
                        {estabelecimentos.map((estab) => (
                          <SelectItem key={estab.id} value={estab.id}>
                            {estab.nome} - R$ {estab.diaria.toFixed(2)}/dia
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedEstabelecimento && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-primary/5 rounded-lg border border-primary/20"
                    >
                      <p className="text-sm text-muted-foreground">Diária</p>
                      <p className="text-2xl font-bold text-green-500">
                        R$ {selectedEstabelecimento.diaria.toFixed(2)}
                      </p>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleIniciarTurno}
                    disabled={!selectedEstabelecimentoId || isStartingTurno}
                    className="w-full btn-gradient"
                    size="lg"
                  >
                    {isStartingTurno ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Iniciando...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Iniciar Turno
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Config section even without turno */}
          {estabelecimentos.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                Configure os bairros com suas taxas fixas e os estabelecimentos com valor da diária.
              </p>
              <BairrosManager />
              <EstabelecimentosManager />
            </motion.div>
          )}
        </div>
      </AppLayout>
    );
  }

  // Turno is open - show the normal entregas interface
  return (
    <AppLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold">Entregas</h1>
            <p className="text-muted-foreground mt-1">
              Turno em andamento • {turnoAtual.turno?.tipo_turno || 'Estabelecimento'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleEncerrarTurno}
            disabled={turnoLoading}
            className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <StopCircle className="w-4 h-4" />
            Encerrar Turno
          </Button>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="nova" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Entrega</span>
              <span className="sm:hidden">Nova</span>
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">Histórico</span>
              <span className="sm:hidden">Lista</span>
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Configurar</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nova" className="mt-0">
            <NovaEntregaForm 
              estabelecimentoId={selectedEstabelecimentoId || ''} 
              diaria={selectedEstabelecimento?.diaria || 0} 
            />
          </TabsContent>

          <TabsContent value="historico" className="mt-0">
            <EntregasList />
          </TabsContent>

          <TabsContent value="config" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground mb-4">
                Configure os bairros com suas taxas fixas e os estabelecimentos com valor da diária.
              </p>
              <BairrosManager />
              <EstabelecimentosManager />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
