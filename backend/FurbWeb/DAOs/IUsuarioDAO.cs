using FurbWeb.Models;

namespace FurbWeb.DAOs;

public interface IUsuarioDAO
{
    Task<Usuario?> GetByLoginAsync(string login);
    Task<Usuario?> GetByIdAsync(int id);
    Task<Usuario> CreateAsync(Usuario usuario);
}

