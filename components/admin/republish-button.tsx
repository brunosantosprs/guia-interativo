'use client';

import { useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

/**
 * Dispara a revalidação sob demanda das principais rotas do site.
 * Útil depois de várias edições em sequência, quando se quer publicar tudo
 * de uma vez sem esperar o intervalo de ISR.
 */
export function RepublishButton() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function republish() {
    setLoading(true);
    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths: ['/', '/blog', '/tipos-de-cortinas', '/servicos', '/sobre', '/contato'],
        }),
      });
      const result = await response.json();

      toast({
        variant: result.success ? 'success' : 'destructive',
        title: result.success ? 'Site republicado' : 'Falha ao republicar',
        description: result.success
          ? 'As páginas principais foram atualizadas.'
          : (result.error ?? 'Tente novamente.'),
      });
    } catch {
      toast({
        variant: 'destructive',
        title: 'Falha de conexão',
        description: 'Não foi possível contatar o servidor.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={republish} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
      Republicar
    </Button>
  );
}
