using System.ComponentModel.DataAnnotations;

namespace FurbWeb.DTOs;

public class CriarClienteRequest
{
    [Required(ErrorMessage = "Nome do cliente é obrigatório")]
    [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
    public string NomeCliente { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefone é obrigatório")]
    [RegularExpression(@"^\d{10,11}$", ErrorMessage = "Telefone deve conter 10 ou 11 dígitos")]
    public string TelefoneCliente { get; set; } = string.Empty;
}
