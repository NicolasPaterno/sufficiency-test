using FurbWeb.Models;

namespace FurbWeb.DAOs;

public interface IProdutoDAO
{
    Task<List<Produto>> GetAllAsync();
    Task<Produto?> GetByIdAsync(int id);
    Task<Produto> CreateAsync(Produto produto);
    Task<Produto> UpdateAsync(Produto produto);
    Task DeleteAsync(int id);
}

