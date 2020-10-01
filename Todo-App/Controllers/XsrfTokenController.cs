using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Todo_App.Controllers
{
    /**
     * configuration base on the following resources:
     * https://docs.microsoft.com/en-us/aspnet/core/security/anti-request-forgery
     */
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class XsrfTokenController : ControllerBase
    {
        private readonly IAntiforgery _antiforgery;
        private readonly ILogger<XsrfTokenController> _logger;

        public XsrfTokenController(
                IAntiforgery antiforgery,
                ILogger<XsrfTokenController> logger)
        {
            this._antiforgery = antiforgery;
            this._logger = logger;
        }

        [HttpGet]
        [IgnoreAntiforgeryToken]
        public IActionResult GetToken() {
            var tokens = this._antiforgery.GetAndStoreTokens(HttpContext);
            HttpContext
                .Response
                .Cookies
                .Append(
                    "X-XSRF-TOKEN",
                    tokens.RequestToken,
                    new CookieOptions() {HttpOnly = false}
                );

            return NoContent();
        }
    }
}
