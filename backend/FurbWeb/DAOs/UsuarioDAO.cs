using Microsoft.EntityFrameworkCore;
using FurbWeb.Data;
using FurbWeb.Models;

namespace FurbWeb.DAOs;

public class UsuarioDAO : IUsuarioDAO
{
    private readonly ApplicationDbContext _context;

    public UsuarioDAO(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> GetByLoginAsync(string login)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Login == login);
    }

    public async Task<Usuario?> GetByIdAsync(int id)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<Usuario> CreateAsync(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return usuario;
    }
}

