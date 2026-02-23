'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { clientesApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { Cliente, CriarClienteRequest } from '@/types/comanda';
import { Users, UserPlus } from 'lucide-react';

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nomeCliente, setNomeCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadClientes();
  }, [router]);

  const loadClientes = async () => {
    try {
      setLoading(true);
      const data = await clientesApi.getAll();
      setClientes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const nome = nomeCliente.trim();
    const telefone = telefoneCliente.replace(/\D/g, '');
    if (!nome || !telefone) {
      setError('Preencha nome e telefone');
      return;
    }
    if (telefone.length < 10 || telefone.length > 11) {
      setError('Telefone deve ter 10 ou 11 dígitos');
      return;
    }
    try {
      setSaving(true);
      await clientesApi.create({ nomeCliente: nome, telefoneCliente: telefone });
      setNomeCliente('');
      setTelefoneCliente('');
      await loadClientes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar cliente');
    } finally {
      setSaving(false);
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
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Cadastro de clientes
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Cadastre clientes para usar ao abrir comandas
          </p>
        </div>

        <Card className="mb-6 border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Novo cliente
            </CardTitle>
            <CardDescription>Preencha e clique em Cadastrar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="nomeCliente">Nome</Label>
                <Input
                  id="nomeCliente"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  placeholder="Nome do cliente"
                  disabled={saving}
                  maxLength={100}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="telefoneCliente">Telefone (apenas números)</Label>
                <Input
                  id="telefoneCliente"
                  value={telefoneCliente}
                  onChange={(e) => setTelefoneCliente(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 ou 11 dígitos"
                  disabled={saving}
                  maxLength={11}
                  inputMode="numeric"
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </div>
            </form>
            {error && (
              <p className="text-destructive text-sm mt-3">{error}</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle>Clientes cadastrados</CardTitle>
            <CardDescription>{clientes.length} cliente(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {clientes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhum cliente cadastrado. Use o formulário acima para cadastrar.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((c) => (
                    <TableRow key={c.idCliente}>
                      <TableCell className="font-medium">{c.idCliente}</TableCell>
                      <TableCell>{c.nomeCliente}</TableCell>
                      <TableCell>{c.telefoneCliente}</TableCell>
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
