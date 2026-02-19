export interface LoginRequest {
  login: string;
  senha: string;
}

export interface RegisterRequest {
  login: string;
  senha: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

