using System.Text.Json.Serialization;

namespace FurbWeb.DTOs;

public class LoginResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;
    
    [JsonPropertyName("token_type")]
    public string TokenType { get; set; } = "Bearer";
    
    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}

