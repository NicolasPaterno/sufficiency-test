namespace FurbWeb.DTOs;

public class ComandaDTO
{
    public int Id { get; set; }
    public int IdCliente { get; set; }
    public string NomeCliente { get; set; } = string.Empty;
    public string TelefoneCliente { get; set; } = string.Empty;
    public List<ProdutoDTO> Produtos { get; set; } = new();
}

