using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FurbWeb.Models;

[Table("Comandas")]
public class Comanda
{
    [Key]
    public int Id { get; set; }

    [Required]
    [Column("IdCliente")]
    public int IdCliente { get; set; }

    [ForeignKey("IdCliente")]
    public virtual Cliente Cliente { get; set; } = null!;

    public virtual ICollection<ComandaProduto> ComandaProdutos { get; set; } = new List<ComandaProduto>();

    [Required]
    [Column("DataCriacao")]
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
}

