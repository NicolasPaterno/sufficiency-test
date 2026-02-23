'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Header } from '@/components/Header';
import { comandasApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { CriarProdutoRequest } from '@/types/comanda';
import { Pencil } from 'lucide-react';

export default function EditarComandaPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [produtos, setProdutos] = useState<CriarProdutoRequest[]>([]);
  const [produtoNome, setProdutoNome] = useState('');
  const [produtoPreco, setProdutoPreco] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadComanda, setLoadComanda] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }
    if (!id) return;
    const load = async () => {
      try {
        setLoadComanda(true);
        const data = await comandasApi.getById(id);
        setProdutos(
          data.produtos.map((p) => ({ nome: p.nome, preco: p.preco }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar comanda');
      } finally {
        setLoadComanda(false);
      }
    };
    load();
  }, [id, router]);

  const handleAddProduto = () => {
    if (!produtoNome || !produtoPreco) {
      setError('Preencha todos os campos do produto');
      return;
    }
    const preco = parseFloat(produtoPreco);
    if (isNaN(preco) || preco < 0) {
      setError('Preço inválido');
      return;
    }
    setProdutos([...produtos, { nome: produtoNome, preco }]);
    setProdutoNome('');
    setProdutoPreco('');
    setError('');
  };

  const handleRemoveProduto = (index: number) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (produtos.length === 0) {
      setError('Adicione pelo menos um produto');
      return;
    }
    try {
      setLoading(true);
      await comandasApi.update(id, { produtos });
      router.push(`/comandas/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar comanda');
    } finally {
      setLoading(false);
    }
  };

  if (loadComanda) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  const total = produtos.reduce((sum, p) => sum + p.preco, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Pencil className="h-7 w-7 text-primary" />
            Editar comanda
          </h1>
          <Link href={`/comandas/${id}`}>
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-4 border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Adicionar produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="produtoNome">Nome</Label>
                  <Input
                    id="produtoNome"
                    value={produtoNome}
                    onChange={(e) => setProdutoNome(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="produtoPreco">Preço</Label>
                  <Input
                    id="produtoPreco"
                    type="number"
                    step="0.01"
                    value={produtoPreco}
                    onChange={(e) => setProdutoPreco(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
              <Button type="button" onClick={handleAddProduto} disabled={loading}>
                Adicionar Produto
              </Button>
            </CardContent>
          </Card>

          {produtos.length > 0 && (
            <Card className="mb-4 border-2 shadow-sm">
              <CardHeader>
                <CardTitle>Produtos da comanda</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.map((p, index) => (
                      <TableRow key={index}>
                        <TableCell>{p.nome}</TableCell>
                        <TableCell className="text-right">
                          R$ {p.preco.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveProduto(index)}
                            disabled={loading}
                          >
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        R$ {total.toFixed(2)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      </main>
    </div>
  );
}
