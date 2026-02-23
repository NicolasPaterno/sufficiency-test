import { auth } from './auth';
import type { 
  Cliente, 
  Comanda, 
  CriarClienteRequest,
  CriarComandaRequest, 
  AtualizarComandaRequest,
  SuccessResponse 
} from '@/types/comanda';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth';

const API_BASE_URL = 'http://localhost:8080/FurbWeb/v1';

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = auth.getToken();
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      auth.removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

function getMensagemErroLogin(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('load'))
      return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080';
    return err.message;
  }
  return 'Erro ao fazer login. Tente novamente.';
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Login ou senha inválidos' }));
        throw new Error(error.message || 'Login ou senha inválidos');
      }

      const data: LoginResponse = await response.json();
      auth.setToken(data.access_token);
      return data;
    } catch (err) {
      if (err instanceof Error && err.message !== 'Login ou senha inválidos')
        throw new Error(getMensagemErroLogin(err));
      throw err;
    }
  },

  register: async (credentials: RegisterRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao criar conta' }));
      throw new Error(error.message || 'Erro ao criar conta');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await fetchWithAuth('/auth/logout', {
        method: 'POST',
      });
    } finally {
      auth.removeToken();
    }
  },
};

export const clientesApi = {
  getAll: async (nome?: string): Promise<Cliente[]> => {
    const query = nome != null && nome.trim() !== '' ? `?nome=${encodeURIComponent(nome.trim())}` : '';
    return fetchWithAuth<Cliente[]>(`/clientes${query}`);
  },

  create: async (cliente: CriarClienteRequest): Promise<Cliente> => {
    return fetchWithAuth<Cliente>('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  },
};

export const comandasApi = {
  getAll: async (): Promise<Cliente[]> => {
    return fetchWithAuth<Cliente[]>('/comandas');
  },

  getById: async (id: number): Promise<Comanda> => {
    return fetchWithAuth<Comanda>(`/comandas/${id}`);
  },

  create: async (comanda: CriarComandaRequest): Promise<Comanda> => {
    return fetchWithAuth<Comanda>('/comandas', {
      method: 'POST',
      body: JSON.stringify(comanda),
    });
  },

  update: async (id: number, comanda: AtualizarComandaRequest): Promise<Comanda> => {
    return fetchWithAuth<Comanda>(`/comandas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(comanda),
    });
  },

  delete: async (id: number): Promise<SuccessResponse> => {
    return fetchWithAuth<SuccessResponse>(`/comandas/${id}`, {
      method: 'DELETE',
    });
  },
};

