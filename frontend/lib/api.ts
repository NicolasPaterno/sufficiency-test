import { auth } from './auth';
import type { 
  Cliente, 
  Comanda, 
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
    console.log('Token sendo enviado:', token.substring(0, 20) + '...');
  } else {
    console.warn('Nenhum token encontrado para a requisição:', endpoint);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Se for 401, remover token e redirecionar para login
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

// Auth endpoints
export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login ou senha inválidos' }));
      throw new Error(error.message || 'Erro ao fazer login');
    }

    const data: LoginResponse = await response.json();
    console.log('Resposta do login:', data);
    if (data.access_token) {
      auth.setToken(data.access_token);
      console.log('Token salvo no localStorage');
    } else {
      console.error('Token não encontrado na resposta:', data);
    }
    return data;
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

