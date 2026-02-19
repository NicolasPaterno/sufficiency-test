using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FurbWeb.Models;

[Table("Clientes")]
public class Cliente
{
    [Key]
    [Column("IdCliente")]
    public int IdCliente { get; set; }

    [Required(ErrorMessage = "Nome do cliente é obrigatório")]
    [MaxLength(100, ErrorMessage = "Nome do cliente deve ter no máximo 100 caracteres")]
    [Column("NomeCliente")]
    public string NomeCliente { get; set; } = string.Empty;

    [Required(ErrorMessage = "Telefone do cliente é obrigatório")]
    [RegularExpression(@"^\d{10,11}$", ErrorMessage = "Telefone deve conter 10 ou 11 dígitos")]
    [Column("TelefoneCliente")]
    public string TelefoneCliente { get; set; } = string.Empty;

    public virtual ICollection<Comanda> Comandas { get; set; } = new List<Comanda>();
}

