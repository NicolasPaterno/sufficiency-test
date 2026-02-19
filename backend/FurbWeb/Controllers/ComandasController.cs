using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FurbWeb.DTOs;
using FurbWeb.Services;

namespace FurbWeb.Controllers;

[ApiController]
[Route("FurbWeb/v1/comandas")]
[Authorize]
public class ComandasController : ControllerBase
{
    private readonly ComandaService _comandaService;

    public ComandasController(ComandaService comandaService)
    {
        _comandaService = comandaService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ClienteDTO>>> GetAll()
    {
        try
        {
            var comandas = await _comandaService.GetAllComandasAsync();
            // Retornar clientes únicos conforme especificação do enunciado
            var clientes = comandas
                .GroupBy(c => c.IdCliente)
                .Select(g => new ClienteDTO
                {
                    IdCliente = g.Key,
                    NomeCliente = g.First().NomeCliente,
                    TelefoneCliente = g.First().TelefoneCliente
                })
                .ToList();

            return Ok(clientes);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro ao buscar comandas", error = ex.Message });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ComandaDTO>> GetById(int id)
    {
        try
        {
            // Primeiro tenta buscar como ID de comanda
            var comanda = await _comandaService.GetComandaByIdAsync(id);
            
            if (comanda != null)
            {
                return Ok(comanda);
            }

            // Se não encontrar, tenta buscar como ID de cliente (primeira comanda do cliente)
            var comandasCliente = await _comandaService.GetComandasByClienteIdAsync(id);
            if (comandasCliente.Any())
            {
                return Ok(comandasCliente.First());
            }

            return NotFound(new { message = "Comanda não encontrada" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro ao buscar comanda", error = ex.Message });
        }
    }

    [HttpPost]
    public async Task<ActionResult<ComandaDTO>> Create([FromBody] CriarComandaRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var comanda = await _comandaService.CreateComandaAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = comanda.Id }, comanda);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro ao criar comanda", error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ComandaDTO>> Update(int id, [FromBody] AtualizarComandaRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var comanda = await _comandaService.UpdateComandaAsync(id, request);
            
            if (comanda == null)
            {
                return NotFound(new { message = "Comanda não encontrada" });
            }

            return Ok(comanda);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro ao atualizar comanda", error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<SuccessResponse>> Delete(int id)
    {
        try
        {
            var deleted = await _comandaService.DeleteComandaAsync(id);
            
            if (!deleted)
            {
                return NotFound(new { message = "Comanda não encontrada" });
            }

            return Ok(new SuccessResponse
            {
                Success = new SuccessMessage
                {
                    Mensagem = "comanda removida"
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro ao remover comanda", error = ex.Message });
        }
    }
}

