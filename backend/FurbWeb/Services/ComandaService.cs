using FurbWeb.DAOs;
using FurbWeb.DTOs;
using FurbWeb.Models;

namespace FurbWeb.Services;

public class ComandaService
{
    private readonly IComandaDAO _comandaDAO;
    private readonly IClienteDAO _clienteDAO;
    private readonly IProdutoDAO _produtoDAO;

    public ComandaService(
        IComandaDAO comandaDAO,
        IClienteDAO clienteDAO,
        IProdutoDAO produtoDAO)
    {
        _comandaDAO = comandaDAO;
        _clienteDAO = clienteDAO;
        _produtoDAO = produtoDAO;
    }

    public async Task<List<ComandaDTO>> GetAllComandasAsync()
    {
        var comandas = await _comandaDAO.GetAllAsync();
        var result = new List<ComandaDTO>();
        foreach (var comanda in comandas)
        {
            var comandaCompleta = await _comandaDAO.GetWithProdutosAsync(comanda.Id);
            if (comandaCompleta != null)
            {
                result.Add(MapToDTOWithProdutos(comandaCompleta));
            }
        }
        return result;
    }

    public async Task<List<ComandaDTO>> GetComandasByClienteIdAsync(int clienteId)
    {
        var todasComandas = await GetAllComandasAsync();
        return todasComandas.Where(c => c.IdCliente == clienteId).ToList();
    }

    public async Task<ComandaDTO?> GetComandaByIdAsync(int id)
    {
        var comanda = await _comandaDAO.GetWithProdutosAsync(id);
        if (comanda == null) return null;
        return MapToDTOWithProdutos(comanda);
    }

    public async Task<ComandaDTO> CreateComandaAsync(CriarComandaRequest request)
    {
        var cliente = new Cliente
        {
            NomeCliente = request.NomeCliente,
            TelefoneCliente = request.TelefoneCliente
        };
        await _clienteDAO.CreateAsync(cliente);

        var comanda = new Comanda
        {
            IdCliente = cliente.IdCliente,
            DataCriacao = DateTime.UtcNow
        };

        foreach (var produtoRequest in request.Produtos)
        {
            var produto = new Produto
            {
                Nome = produtoRequest.Nome,
                Preco = produtoRequest.Preco
            };
            await _produtoDAO.CreateAsync(produto);

            comanda.ComandaProdutos.Add(new ComandaProduto
            {
                Comanda = comanda,
                Produto = produto
            });
        }

        var comandaCriada = await _comandaDAO.CreateAsync(comanda);
        var comandaCompleta = await _comandaDAO.GetWithProdutosAsync(comandaCriada.Id);
        if (comandaCompleta == null)
            throw new Exception("Erro ao recuperar comanda criada");
        return MapToDTOWithProdutos(comandaCompleta);
    }

    public async Task<ComandaDTO?> UpdateComandaAsync(int id, AtualizarComandaRequest request)
    {
        var comanda = await _comandaDAO.GetWithProdutosAsync(id);
        if (comanda == null) return null;

        if (request.Produtos != null && request.Produtos.Any())
        {
            comanda.ComandaProdutos.Clear();

            foreach (var produtoRequest in request.Produtos)
            {
                var produto = new Produto
                {
                    Nome = produtoRequest.Nome,
                    Preco = produtoRequest.Preco
                };
                await _produtoDAO.CreateAsync(produto);

                comanda.ComandaProdutos.Add(new ComandaProduto
                {
                    Comanda = comanda,
                    Produto = produto
                });
            }
        }

        await _comandaDAO.UpdateAsync(comanda);
        var comandaAtualizada = await _comandaDAO.GetWithProdutosAsync(id);
        if (comandaAtualizada == null)
            throw new Exception("Erro ao recuperar comanda atualizada");
        return MapToDTOWithProdutos(comandaAtualizada);
    }

    public async Task<bool> DeleteComandaAsync(int id)
    {
        var comanda = await _comandaDAO.GetByIdAsync(id);
        if (comanda == null) return false;

        await _comandaDAO.DeleteAsync(id);
        return true;
    }

    private ComandaDTO MapToDTO(Comanda comanda)
    {
        return new ComandaDTO
        {
            Id = comanda.Id,
            IdCliente = comanda.Cliente.IdCliente,
            NomeCliente = comanda.Cliente.NomeCliente,
            TelefoneCliente = comanda.Cliente.TelefoneCliente,
            Produtos = new List<ProdutoDTO>()
        };
    }

    private ComandaDTO MapToDTOWithProdutos(Comanda comanda)
    {
        return new ComandaDTO
        {
            Id = comanda.Id,
            IdCliente = comanda.Cliente.IdCliente,
            NomeCliente = comanda.Cliente.NomeCliente,
            TelefoneCliente = comanda.Cliente.TelefoneCliente,
            Produtos = comanda.ComandaProdutos
                .Select(cp => new ProdutoDTO
                {
                    Id = cp.Produto.Id,
                    Nome = cp.Produto.Nome,
                    Preco = cp.Produto.Preco
                })
                .ToList()
        };
    }
}

