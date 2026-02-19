'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { comandasApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { Comanda } from '@/types/comanda';

export default function ComandaDetalhesPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [comanda, setComanda] = useState<Comanda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta comanda?')) {
      return;
    }

    try {
      await comandasApi.delete(id);
      router.push('/comandas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir comanda');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error && !comanda) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <p className="text-red-500">{error}</p>
              <Link href="/comandas">
                <Button className="mt-4">Voltar</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!comanda) {
    return null;
  }

  const total = comanda.produtos.reduce((sum, produto) => sum + produto.preco, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Detalhes da Comanda</h1>
          <Link href="/comandas">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>ID Cliente:</strong> {comanda.idCliente}</p>
              <p><strong>Nome:</strong> {comanda.nomeCliente}</p>
              <p><strong>Telefone:</strong> {comanda.telefoneCliente}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
            <CardDescription>Itens da comanda</CardDescription>
          </CardHeader>
          <CardContent>
            {comanda.produtos.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Nenhum produto na comanda</p>
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

        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDelete}>
            Excluir Comanda
          </Button>
        </div>
      </div>
    </div>
  );
}

