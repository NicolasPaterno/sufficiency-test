'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/Header';
import { comandasApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { ComandaResumo } from '@/types/comanda';
import { Eye, LayoutDashboard, Pencil, PlusCircle, Trash2 } from 'lucide-react';

export default function ComandasPage() {
  const router = useRouter();
  const [comandas, setComandas] = useState<ComandaResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmandoExclusaoId, setConfirmandoExclusaoId] = useState<number | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadComandas();
  }, [router]);

  const loadComandas = async () => {
    try {
      setLoading(true);
      const data = await comandasApi.getAll();
      setComandas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar comandas');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirClick = (idComanda: number) => {
    setConfirmandoExclusaoId(idComanda);
    setError('');
  };

  const handleCancelarExclusao = () => {
    setConfirmandoExclusaoId(null);
  };

  const handleConfirmarExclusao = async (idComanda: number) => {
    try {
      setExcluindo(true);
      await comandasApi.delete(idComanda);
      setConfirmandoExclusaoId(null);
      await loadComandas();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir comanda');
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-7 w-7 text-primary" />
              Comandas
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Clientes com comandas cadastradas
            </p>
          </div>
          <Link href="/comandas/nova">
            <Button className="w-full sm:w-auto gap-2">
              <PlusCircle className="h-4 w-4" />
              Nova Comanda
            </Button>
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle>Lista de clientes</CardTitle>
            <CardDescription>Clique em Ver comanda para abrir os detalhes</CardDescription>
          </CardHeader>
          <CardContent>
            {comandas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="mb-4">Nenhuma comanda encontrada.</p>
                <Link href="/comandas/nova">
                  <Button>Abrir primeira comanda</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comandas.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.idCliente}</TableCell>
                      <TableCell>{item.nomeCliente}</TableCell>
                      <TableCell>{item.telefoneCliente}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/comandas/${item.id}`}>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/comandas/${item.id}/editar`}>
                          <Button variant="outline" size="sm" className="gap-1.5 ml-1">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        {confirmandoExclusaoId === item.id ? (
                          <span className="inline-flex items-center gap-2 ml-1">
                            <span className="text-sm text-muted-foreground">Deseja excluir?</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-1.5"
                              onClick={() => handleConfirmarExclusao(item.id)}
                              disabled={excluindo}
                            >
                              <Trash2 className="h-4 w-4" />
                              {excluindo ? 'Excluindo...' : 'Sim'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancelarExclusao}
                              disabled={excluindo}
                            >
                              Não
                            </Button>
                          </span>
                        ) : (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1.5 ml-1"
                            onClick={() => handleExcluirClick(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

