namespace FurbWeb.DTOs;

public class SuccessResponse
{
    public SuccessMessage Success { get; set; } = new();
}

public class SuccessMessage
{
    public string Mensagem { get; set; } = string.Empty;
}

