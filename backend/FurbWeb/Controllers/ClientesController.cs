using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FurbWeb.DAOs;
using FurbWeb.DTOs;
using FurbWeb.Models;

namespace FurbWeb.Controllers;

[ApiController]
[Route("FurbWeb/v1/clientes")]
[Authorize]
public class ClientesController : ControllerBase
{
    private readonly IClienteDAO _clienteDAO;

    public ClientesController(IClienteDAO clienteDAO)
    {
        _clienteDAO = clienteDAO;
    }

    [HttpGet]
    public async Task<ActionResult<List<ClienteDTO>>> GetAll([FromQuery] string? nome = null)
    {
        try
        {
            var clientes = await _clienteDAO.GetAllAsync();
            if (!string.IsNullOrWhiteSpace(nome))
            {
                var termo = nome.Trim().ToLowerInvariant();
                clientes = clientes
                    .Where(c => c.NomeCliente.ToLowerInvariant().Contains(termo))
                    .ToList();
            }
            var dtos = clientes.Select(c => new ClienteDTO
            {
                IdCliente = c.IdCliente,
                NomeCliente = c.NomeCliente,
                TelefoneCliente = c.TelefoneCliente
            }).ToList();
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro ao buscar clientes", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ClienteDTO>> GetById(int id)
    {
        var cliente = await _clienteDAO.GetByIdAsync(id);
        if (cliente == null)
            return NotFound(new { message = "Cliente não encontrado" });
        return Ok(new ClienteDTO
        {
            IdCliente = cliente.IdCliente,
            NomeCliente = cliente.NomeCliente,
            TelefoneCliente = cliente.TelefoneCliente
        });
    }

    [HttpPost]
    public async Task<ActionResult<ClienteDTO>> Create([FromBody] CriarClienteRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);
        try
        {
            var cliente = new Cliente
            {
                NomeCliente = request.NomeCliente,
                TelefoneCliente = request.TelefoneCliente
            };
            await _clienteDAO.CreateAsync(cliente);
            return CreatedAtAction(nameof(GetById), new { id = cliente.IdCliente }, new ClienteDTO
            {
                IdCliente = cliente.IdCliente,
                NomeCliente = cliente.NomeCliente,
                TelefoneCliente = cliente.TelefoneCliente
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro ao cadastrar cliente", error = ex.Message });
        }
    }
}
