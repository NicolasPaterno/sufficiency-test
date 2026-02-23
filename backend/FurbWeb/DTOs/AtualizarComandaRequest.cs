namespace FurbWeb.DTOs;

public class AtualizarComandaRequest
{
    /// <summary>Se informado, altera o cliente da comanda para o cliente com este ID.</summary>
    public int? IdCliente { get; set; }

    public List<CriarProdutoRequest>? Produtos { get; set; }
}

