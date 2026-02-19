'use client';

const TOKEN_KEY = 'auth_token';

export const auth = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      console.log('Token recuperado do localStorage');
    } else {
      console.warn('Nenhum token encontrado no localStorage');
    }
    return token;
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
    console.log('Token armazenado:', token.substring(0, 20) + '...');
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return auth.getToken() !== null;
  },
};

