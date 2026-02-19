using Microsoft.EntityFrameworkCore;
using FurbWeb.Data;
using FurbWeb.Models;

namespace FurbWeb.DAOs;

public class ComandaDAO : IComandaDAO
{
    private readonly ApplicationDbContext _context;

    public ComandaDAO(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Comanda>> GetAllAsync()
    {
        return await _context.Comandas
            .Include(c => c.Cliente)
            .ToListAsync();
    }

    public async Task<Comanda?> GetByIdAsync(int id)
    {
        return await _context.Comandas
            .Include(c => c.Cliente)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Comanda?> GetWithProdutosAsync(int id)
    {
        return await _context.Comandas
            .Include(c => c.Cliente)
            .Include(c => c.ComandaProdutos)
                .ThenInclude(cp => cp.Produto)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Comanda> CreateAsync(Comanda comanda)
    {
        _context.Comandas.Add(comanda);
        await _context.SaveChangesAsync();
        return comanda;
    }

    public async Task<Comanda> UpdateAsync(Comanda comanda)
    {
        _context.Comandas.Update(comanda);
        await _context.SaveChangesAsync();
        return comanda;
    }

    public async Task DeleteAsync(int id)
    {
        var comanda = await GetByIdAsync(id);
        if (comanda != null)
        {
            _context.Comandas.Remove(comanda);
            await _context.SaveChangesAsync();
        }
    }
}

