'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { comandasApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { Produto, CriarComandaRequest, CriarProdutoRequest } from '@/types/comanda';

export default function NovaComandaPage() {
  const router = useRouter();
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [produtos, setProdutos] = useState<CriarProdutoRequest[]>([]);
  const [produtoNome, setProdutoNome] = useState('');
  const [produtoPreco, setProdutoPreco] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    const novoProduto: CriarProdutoRequest = {
      nome: produtoNome,
      preco: preco,
    };

    setProdutos([...produtos, novoProduto]);
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

    if (!nomeCliente || !telefoneCliente) {
      setError('Preencha todos os campos do cliente');
      return;
    }

    if (produtos.length === 0) {
      setError('Adicione pelo menos um produto');
      return;
    }

    try {
      setLoading(true);
      const request: CriarComandaRequest = {
        nomeCliente,
        telefoneCliente,
        produtos,
      };

      await comandasApi.create(request);
      router.push('/comandas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar comanda');
    } finally {
      setLoading(false);
    }
  };

  if (!auth.isAuthenticated()) {
    router.push('/login');
    return null;
  }

  const total = produtos.reduce((sum, produto) => sum + produto.preco, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Nova Comanda</h1>
          <Link href="/comandas">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nomeCliente">Nome do Cliente</Label>
                <Input
                  id="nomeCliente"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefoneCliente">Telefone do Cliente</Label>
                <Input
                  id="telefoneCliente"
                  value={telefoneCliente}
                  onChange={(e) => setTelefoneCliente(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Adicionar Produto</CardTitle>
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
              <Button
                type="button"
                onClick={handleAddProduto}
                disabled={loading}
              >
                Adicionar Produto
              </Button>
            </CardContent>
          </Card>

          {produtos.length > 0 && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Produtos Adicionados</CardTitle>
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
                    {produtos.map((produto, index) => (
                      <TableRow key={index}>
                        <TableCell>{produto.nome}</TableCell>
                        <TableCell className="text-right">
                          R$ {produto.preco.toFixed(2)}
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
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Comanda'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

