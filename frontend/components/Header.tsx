'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/api';
import { auth } from '@/lib/auth';
import { UtensilsCrossed, LayoutDashboard, PlusCircle, LogOut, Home, Users } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const isAuth = auth.isAuthenticated();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {

    } finally {
      router.push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 max-w-6xl mx-auto items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground hover:text-primary transition-colors">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span>Lanchonete</span>
        </Link>

        <nav className="flex items-center gap-2">
          {isAuth ? (
            <>
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Home className="h-4 w-4" />
                  Início
                </Button>
              </Link>
              <Link href="/clientes">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Users className="h-4 w-4" />
                  Clientes
                </Button>
              </Link>
              <Link href="/comandas">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <LayoutDashboard className="h-4 w-4" />
                  Comandas
                </Button>
              </Link>
              <Link href="/comandas/nova">
                <Button size="sm" className="gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  Nova Comanda
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Criar conta
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
