using System.ComponentModel.DataAnnotations;

namespace FurbWeb.DTOs;

public class CriarProdutoRequest
{
    [Required(ErrorMessage = "Nome do produto é obrigatório")]
    [MaxLength(100, ErrorMessage = "Nome do produto deve ter no máximo 100 caracteres")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "Preço é obrigatório")]
    [Range(0, double.MaxValue, ErrorMessage = "Preço deve ser maior ou igual a zero")]
    public decimal Preco { get; set; }
}



