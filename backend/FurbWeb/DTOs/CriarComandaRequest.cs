using System.ComponentModel.DataAnnotations;

namespace FurbWeb.DTOs;

public class CriarComandaRequest
{
    [Required(ErrorMessage = "NomeCliente é obrigatório")]
    public string NomeCliente { get; set; } = string.Empty;

    [Required(ErrorMessage = "TelefoneCliente é obrigatório")]
    public string TelefoneCliente { get; set; } = string.Empty;

    [Required(ErrorMessage = "Produtos são obrigatórios")]
    [MinLength(1, ErrorMessage = "Deve haver pelo menos um produto")]
    public List<CriarProdutoRequest> Produtos { get; set; } = new();
}

