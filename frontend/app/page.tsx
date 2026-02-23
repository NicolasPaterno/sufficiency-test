'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { UtensilsCrossed, LayoutDashboard, PlusCircle, LogIn, UserPlus, Users } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const isAuth = auth.isAuthenticated();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-6xl mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <UtensilsCrossed className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
            Sistema de Comandas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie as comandas da sua lanchonete de forma simples e rápida.
          </p>
        </section>

        {isAuth ? (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            <Link href="/clientes">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Users className="h-5 w-5" />
                  </div>
                  <CardTitle>Clientes</CardTitle>
                  <CardDescription>
                    Cadastrar e gerenciar clientes.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/comandas">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <CardTitle>Ver Comandas</CardTitle>
                  <CardDescription>
                    Listar e acessar todas as comandas.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Link href="/comandas/nova">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <PlusCircle className="h-5 w-5" />
                  </div>
                  <CardTitle>Nova Comanda</CardTitle>
                  <CardDescription>
                    Abrir uma nova comanda para cliente e produtos.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
            <Card className="h-full border-muted bg-muted/30">
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground mb-2">
                  <UtensilsCrossed className="h-5 w-5" />
                </div>
                <CardTitle>Você está conectado</CardTitle>
                <CardDescription>
                  Use o menu acima ou os cards para navegar.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 max-w-xl mx-auto">
            <Link href="/login">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <LogIn className="h-5 w-5" />
                  </div>
                  <CardTitle>Entrar</CardTitle>
                  <CardDescription>
                    Acesse sua conta para gerenciar comandas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Entrar</Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/register">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <CardTitle>Criar conta</CardTitle>
                  <CardDescription>
                    Cadastre-se para usar o sistema de comandas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    Criar conta
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}
