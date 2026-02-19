using Microsoft.EntityFrameworkCore;
using FurbWeb.Data;
using FurbWeb.Models;

namespace FurbWeb.DAOs;

public class ProdutoDAO : IProdutoDAO
{
    private readonly ApplicationDbContext _context;

    public ProdutoDAO(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Produto>> GetAllAsync()
    {
        return await _context.Produtos.ToListAsync();
    }

    public async Task<Produto?> GetByIdAsync(int id)
    {
        return await _context.Produtos
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Produto> CreateAsync(Produto produto)
    {
        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();
        return produto;
    }

    public async Task<Produto> UpdateAsync(Produto produto)
    {
        _context.Produtos.Update(produto);
        await _context.SaveChangesAsync();
        return produto;
    }

    public async Task DeleteAsync(int id)
    {
        var produto = await GetByIdAsync(id);
        if (produto != null)
        {
            _context.Produtos.Remove(produto);
            await _context.SaveChangesAsync();
        }
    }
}

