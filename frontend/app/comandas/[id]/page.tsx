'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/Header';
import { comandasApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { Comanda } from '@/types/comanda';
import { Pencil, Trash2 } from 'lucide-react';

export default function ComandaDetalhesPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [comanda, setComanda] = useState<Comanda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (id) {
      loadComanda();
    }
  }, [id, router]);

  const loadComanda = async () => {
    try {
      setLoading(true);
      const data = await comandasApi.getById(id);
      setComanda(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar comanda');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirClick = () => {
    setConfirmandoExclusao(true);
    setError('');
  };

  const handleCancelarExclusao = () => {
    setConfirmandoExclusao(false);
  };

  const handleConfirmarExclusao = async () => {
    try {
      setExcluindo(true);
      await comandasApi.delete(id);
      router.push('/comandas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir comanda');
      setConfirmandoExclusao(false);
    } finally {
      setExcluindo(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (error && !comanda) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-4xl mx-auto px-4 py-8">
          <Card className="border-2">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
              <Link href="/comandas">
                <Button className="mt-4">Voltar às comandas</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!comanda) {
    return null;
  }

  const total = comanda.produtos.reduce((sum, produto) => sum + produto.preco, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Detalhes da comanda</h1>
          <div className="flex gap-2">
            <Link href="/comandas">
              <Button variant="outline">Voltar</Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <Card className="mb-4 border-2 shadow-sm">
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>ID Cliente:</strong> {comanda.idCliente}</p>
              <p><strong>Nome:</strong> {comanda.nomeCliente}</p>
              <p><strong>Telefone:</strong> {comanda.telefoneCliente}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4 border-2 shadow-sm">
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Itens da comanda</CardDescription>
          </CardHeader>
          <CardContent>
            {comanda.produtos.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Nenhum produto na comanda</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Preço</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comanda.produtos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>{produto.id}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell className="text-right">
                        R$ {produto.preco.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={2} className="font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold">
                      R$ {total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 items-center">
          <Link href={`/comandas/${id}/editar`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          {confirmandoExclusao ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Deseja excluir esta comanda?</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmarExclusao}
                disabled={excluindo}
                className="gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                {excluindo ? 'Excluindo...' : 'Sim, excluir'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelarExclusao}
                disabled={excluindo}
              >
                Não, cancelar
              </Button>
            </div>
          ) : (
            <Button variant="destructive" size="sm" onClick={handleExcluirClick} className="gap-1.5">
              <Trash2 className="h-4 w-4" />
              Excluir comanda
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

