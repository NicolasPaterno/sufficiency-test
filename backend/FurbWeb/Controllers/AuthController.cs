using Microsoft.AspNetCore.Mvc;
using FurbWeb.DTOs;
using FurbWeb.Services;
using FurbWeb.DAOs;
using FurbWeb.Models;
using System.ComponentModel.DataAnnotations;

namespace FurbWeb.Controllers;

[ApiController]
[Route("FurbWeb/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IUsuarioDAO _usuarioDAO;

    public AuthController(AuthService authService, IUsuarioDAO usuarioDAO)
    {
        _authService = authService;
        _usuarioDAO = usuarioDAO;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var response = await _authService.LoginAsync(request);
        
        if (response == null)
        {
            return Unauthorized(new { message = "Login ou senha inválidos" });
        }

        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<ActionResult<Usuario>> Register([FromBody] RegisterRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verificar se o login já existe
        var usuarioExistente = await _usuarioDAO.GetByLoginAsync(request.Login);
        if (usuarioExistente != null)
        {
            return Conflict(new { message = "Login já existe" });
        }

        // Criar novo usuário
        var usuario = new Usuario
        {
            Login = request.Login,
            Senha = _authService.HashPassword(request.Senha)
        };

        var usuarioCriado = await _usuarioDAO.CreateAsync(usuario);
        usuarioCriado.Senha = string.Empty;

        return CreatedAtAction(nameof(Register), new { id = usuarioCriado.Id }, usuarioCriado);
    }

    [HttpPost("logout")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public IActionResult Logout()
    {
        // Como estamos usando JWT stateless, o logout é feito no cliente
        // removendo o token. Este endpoint pode ser usado para logging.
        return Ok(new { message = "Logout realizado com sucesso" });
    }
}

