using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FurbWeb.Models;

[Table("ComandaProdutos")]
public class ComandaProduto
{
    [Key]
    public int Id { get; set; }

    [Required]
    [Column("ComandaId")]
    public int ComandaId { get; set; }

    [Required]
    [Column("ProdutoId")]
    public int ProdutoId { get; set; }

    [ForeignKey("ComandaId")]
    public virtual Comanda Comanda { get; set; } = null!;

    [ForeignKey("ProdutoId")]
    public virtual Produto Produto { get; set; } = null!;
}

