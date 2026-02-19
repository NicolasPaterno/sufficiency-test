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

        var usuarioExistente = await _usuarioDAO.GetByLoginAsync(request.Login);
        if (usuarioExistente != null)
        {
            return Conflict(new { message = "Login já existe" });
        }

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
        return Ok(new { message = "Logout realizado com sucesso" });
    }
}

