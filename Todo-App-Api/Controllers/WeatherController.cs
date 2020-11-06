using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Todo_App_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "TodoAppApiUser")]
    public class WeatherController : ControllerBase
    {
        readonly IHttpClientFactory _httpClientFactory;
        readonly IConfiguration _configuration;
        readonly ILogger<WeatherController> _logger;
        
        public WeatherController(
            IHttpClientFactory httpClientFactory,
            IConfiguration configuration,
            ILogger<WeatherController> logger
        )
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<object>> GetWeather(string lat, string lon)
        {
            var apiKey = _configuration["WeatherApi_Key"];
            var url = "https://api.openweathermap.org/data/2.5/weather?" +
                      $"lat={lat}&" +
                      $"lon={lon}&" +
                      "units=imperial&" +
                      $"appid={apiKey}";

            using var httpClient = _httpClientFactory.CreateClient();
            using var result = await httpClient.GetAsync(url);
            result.EnsureSuccessStatusCode();

            var resultContent = await result.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject(resultContent);
        }
    }
}