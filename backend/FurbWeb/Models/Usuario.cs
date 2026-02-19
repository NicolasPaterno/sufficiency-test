using System.ComponentModel.DataAnnotations;

namespace FurbWeb.Models;

public class Usuario
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Login é obrigatório")]
    [MinLength(3, ErrorMessage = "Login deve ter no mínimo 3 caracteres")]
    [MaxLength(50, ErrorMessage = "Login deve ter no máximo 50 caracteres")]
    public string Login { get; set; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória")]
    [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres")]
    public string Senha { get; set; } = string.Empty;
}

