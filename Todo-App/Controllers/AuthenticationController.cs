using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Interfaces;

namespace Todo_App.Controllers {

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuthenticationController : ControllerBase
    {
        readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            this._authenticationService = authenticationService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<Microsoft.AspNetCore.Identity.SignInResult> Authenticate(
                LoginData loginData
            )
        {
            var result = await this._authenticationService.Authenticate(loginData);
            return result;
        }
    }
}
