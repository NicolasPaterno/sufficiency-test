export interface Cliente {
  idCliente: number;
  nomeCliente: string;
  telefoneCliente: string;
}

export interface Produto {
  id: number;
  nome: string;
  preco: number;
}

export interface Comanda {
  id: number;
  idCliente: number;
  nomeCliente: string;
  telefoneCliente: string;
  produtos: Produto[];
}

export interface CriarProdutoRequest {
  nome: string;
  preco: number;
}

export interface CriarClienteRequest {
  nomeCliente: string;
  telefoneCliente: string;
}

export interface CriarComandaRequest {
  idCliente?: number;
  nomeCliente: string;
  telefoneCliente: string;
  produtos: CriarProdutoRequest[];
}

export interface AtualizarComandaRequest {
  idCliente?: number;
  produtos: CriarProdutoRequest[];
}

export interface SuccessResponse {
  success: {
    mensagem: string;
  };
}

