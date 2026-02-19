using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FurbWeb.Models;

[Table("Produtos")]
public class Produto
{
    [Key]
    public int Id { get; set; }

    [Required(ErrorMessage = "Nome do produto é obrigatório")]
    [MaxLength(100, ErrorMessage = "Nome do produto deve ter no máximo 100 caracteres")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "Preço é obrigatório")]
    [Range(0, double.MaxValue, ErrorMessage = "Preço deve ser maior ou igual a zero")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Preco { get; set; }

    public virtual ICollection<ComandaProduto> ComandaProdutos { get; set; } = new List<ComandaProduto>();
}

