using FurbWeb.Models;

namespace FurbWeb.DAOs;

public interface IComandaDAO
{
    Task<List<Comanda>> GetAllAsync();
    Task<Comanda?> GetByIdAsync(int id);
    Task<Comanda?> GetWithProdutosAsync(int id);
    Task<Comanda> CreateAsync(Comanda comanda);
    Task<Comanda> UpdateAsync(Comanda comanda);
    Task DeleteAsync(int id);
}

