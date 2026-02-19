'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { comandasApi, authApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { Cliente } from '@/types/comanda';

export default function ComandasPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      setClientes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar comandas');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Comandas</h1>
          <div className="flex gap-2">
            <Link href="/comandas/nova">
              <Button>Nova Comanda</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Clientes com comandas cadastradas</CardDescription>
          </CardHeader>
          <CardContent>
            {clientes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma comanda encontrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Cliente</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.idCliente}>
                      <TableCell>{cliente.idCliente}</TableCell>
                      <TableCell>{cliente.nomeCliente}</TableCell>
                      <TableCell>{cliente.telefoneCliente}</TableCell>
                      <TableCell>
                        <Link href={`/comandas/${cliente.idCliente}`}>
                          <Button variant="outline" size="sm">
                            Ver Comandas
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

