using Microsoft.AspNetCore.Mvc;
using FurbWeb.DAOs;
using FurbWeb.Models;
using FurbWeb.Services;

namespace FurbWeb.Controllers;

[ApiController]
[Route("FurbWeb/v1/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioDAO _usuarioDAO;
    private readonly AuthService _authService;

    public UsuariosController(IUsuarioDAO usuarioDAO, AuthService authService)
    {
        _usuarioDAO = usuarioDAO;
        _authService = authService;
    }

    [HttpPost]
    public async Task<ActionResult<Usuario>> Create([FromBody] Usuario usuario)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verificar se o login já existe
        var usuarioExistente = await _usuarioDAO.GetByLoginAsync(usuario.Login);
        if (usuarioExistente != null)
        {
            return Conflict(new { message = "Login já existe" });
        }

        // Criptografar senha
        usuario.Senha = _authService.HashPassword(usuario.Senha);

        var usuarioCriado = await _usuarioDAO.CreateAsync(usuario);
        usuarioCriado.Senha = string.Empty; // Não retornar senha

        return CreatedAtAction(nameof(GetById), new { id = usuarioCriado.Id }, usuarioCriado);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Usuario>> GetById(int id)
    {
        var usuario = await _usuarioDAO.GetByIdAsync(id);
        if (usuario == null)
        {
            return NotFound(new { message = "Usuário não encontrado" });
        }

        usuario.Senha = string.Empty; // Não retornar senha
        return Ok(usuario);
    }
}

