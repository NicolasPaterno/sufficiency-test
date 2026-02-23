'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Header } from '@/components/Header';
import { comandasApi, clientesApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import type { Cliente, CriarComandaRequest, CriarProdutoRequest, CriarClienteRequest } from '@/types/comanda';
import { PlusCircle, UserPlus, ChevronDown } from 'lucide-react';

export default function NovaComandaPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [searchCliente, setSearchCliente] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [modalCadastroAberto, setModalCadastroAberto] = useState(false);
  const [nomeNovo, setNomeNovo] = useState('');
  const [telefoneNovo, setTelefoneNovo] = useState('');
  const [produtos, setProdutos] = useState<CriarProdutoRequest[]>([]);
  const [produtoNome, setProdutoNome] = useState('');
  const [produtoPreco, setProdutoPreco] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingClientes(true);
      try {
        const list = await clientesApi.getAll();
        if (!cancelled) setClientes(list);
      } catch {
        if (!cancelled) setClientes([]);
      } finally {
        if (!cancelled) setLoadingClientes(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownAberto(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLower = searchCliente.trim().toLowerCase();
  const clientesFiltrados = searchLower
    ? clientes.filter((c) => c.nomeCliente.toLowerCase().includes(searchLower))
    : clientes;
  const mostraCadastroRapido = searchCliente.trim() !== '' && clientesFiltrados.length === 0;

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
    if (!clienteSelecionado) {
      setError('Selecione ou cadastre um cliente');
      return;
    }
    if (produtos.length === 0) {
      setError('Adicione pelo menos um produto');
      return;
    }
    try {
      setLoading(true);
      const request: CriarComandaRequest = {
        idCliente: clienteSelecionado.idCliente,
        nomeCliente: clienteSelecionado.nomeCliente,
        telefoneCliente: clienteSelecionado.telefoneCliente,
        produtos,
      };
      await comandasApi.create(request);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar comanda');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCadastroRapido = () => {
    setNomeNovo(searchCliente.trim());
    setTelefoneNovo('');
    setModalCadastroAberto(true);
    setDropdownAberto(false);
  };

  const salvarCadastroRapido = async () => {
    const nome = nomeNovo.trim();
    const tel = telefoneNovo.replace(/\D/g, '');
    if (!nome) {
      setError('Nome do cliente é obrigatório');
      return;
    }
    if (tel.length < 10 || tel.length > 11) {
      setError('Telefone deve ter 10 ou 11 dígitos');
      return;
    }
    setError('');
    try {
      setLoadingModal(true);
      const body: CriarClienteRequest = { nomeCliente: nome, telefoneCliente: tel };
      const novo = await clientesApi.create(body);
      setClientes((prev) => [...prev, novo]);
      setClienteSelecionado(novo);
      setSearchCliente('');
      setModalCadastroAberto(false);
      setNomeNovo('');
      setTelefoneNovo('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar cliente');
    } finally {
      setLoadingModal(false);
    }
  };

  if (!auth.isAuthenticated()) {
    router.push('/login');
    return null;
  }

  const total = produtos.reduce((sum, p) => sum + p.preco, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PlusCircle className="h-7 w-7 text-primary" />
            Nova comanda
          </h1>
          <Link href="/comandas">
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
              <CardTitle>Cliente (obrigatório)</CardTitle>
              <CardDescription>Toda comanda deve ter um cliente. Pesquise por nome ou cadastre rapidamente.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {clienteSelecionado ? (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 p-3">
                  <div>
                    <p className="font-medium">{clienteSelecionado.nomeCliente}</p>
                    <p className="text-sm text-muted-foreground">{clienteSelecionado.telefoneCliente}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setClienteSelecionado(null);
                      setSearchCliente('');
                    }}
                    disabled={loading}
                  >
                    Trocar cliente
                  </Button>
                </div>
              ) : (
                <div className="space-y-2" ref={dropdownRef}>
                  <Label>Buscar cliente por nome</Label>
                  <div className="relative">
                    <Input
                      placeholder="Digite o nome do cliente..."
                      value={searchCliente}
                      onChange={(e) => {
                        setSearchCliente(e.target.value);
                        setDropdownAberto(true);
                      }}
                      onFocus={() => setDropdownAberto(true)}
                      disabled={loading || loadingClientes}
                    />
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    {dropdownAberto && (
                      <ul className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-60 overflow-auto">
                        {loadingClientes ? (
                          <li className="px-3 py-2 text-sm text-muted-foreground">Carregando...</li>
                        ) : mostraCadastroRapido ? (
                          <li>
                            <button
                              type="button"
                              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                              onClick={abrirModalCadastroRapido}
                            >
                              <UserPlus className="h-4 w-4" />
                              Cadastrar rápido: &quot;{searchCliente.trim()}&quot;
                            </button>
                          </li>
                        ) : clientesFiltrados.length === 0 ? (
                          <>
                            <li className="px-3 py-2 text-sm text-muted-foreground">Nenhum cliente encontrado. Use a opção abaixo para cadastrar.</li>
                            <li>
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                                onClick={abrirModalCadastroRapido}
                              >
                                <UserPlus className="h-4 w-4" />
                                Cadastrar rápido
                              </button>
                            </li>
                          </>
                        ) : (
                          clientesFiltrados.map((c) => (
                            <li key={c.idCliente}>
                              <button
                                type="button"
                                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md"
                                onClick={() => {
                                  setClienteSelecionado(c);
                                  setSearchCliente('');
                                  setDropdownAberto(false);
                                }}
                              >
                                {c.nomeCliente} — {c.telefoneCliente}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-4 border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Adicionar produto</CardTitle>
              <CardDescription>Nome e preço de cada item</CardDescription>
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
                <CardTitle>Produtos na comanda</CardTitle>
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
                        <TableCell className="text-right">R$ {produto.preco.toFixed(2)}</TableCell>
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
                      <TableCell className="text-right font-bold">R$ {total.toFixed(2)}</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar comanda'}
            </Button>
          </div>
        </form>
      </main>

      <Dialog open={modalCadastroAberto} onOpenChange={setModalCadastroAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastro rápido de cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados. O cliente será vinculado à comanda sem sair desta página.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="modalNome">Nome</Label>
              <Input
                id="modalNome"
                value={nomeNovo}
                onChange={(e) => setNomeNovo(e.target.value)}
                disabled={loadingModal}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modalTelefone">Telefone (apenas números)</Label>
              <Input
                id="modalTelefone"
                value={telefoneNovo}
                onChange={(e) => setTelefoneNovo(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="10 ou 11 dígitos"
                disabled={loadingModal}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalCadastroAberto(false)} disabled={loadingModal}>
              Cancelar
            </Button>
            <Button onClick={salvarCadastroRapido} disabled={loadingModal}>
              {loadingModal ? 'Salvando...' : 'Cadastrar e selecionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
