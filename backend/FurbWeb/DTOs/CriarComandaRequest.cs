using System.ComponentModel.DataAnnotations;

namespace FurbWeb.DTOs;

/// <summary>Comanda obrigatoriamente possui um cliente (identificado por IdCliente ou por NomeCliente + TelefoneCliente).</summary>
public class CriarComandaRequest
{
    public int? IdCliente { get; set; }

    [Required(ErrorMessage = "Nome do cliente é obrigatório")]
    public string NomeCliente { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefone do cliente é obrigatório")]
    public string TelefoneCliente { get; set; } = string.Empty;

    [Required(ErrorMessage = "Produtos são obrigatórios")]
    [MinLength(1, ErrorMessage = "Deve haver pelo menos um produto")]
    public List<CriarProdutoRequest> Produtos { get; set; } = new();
}

