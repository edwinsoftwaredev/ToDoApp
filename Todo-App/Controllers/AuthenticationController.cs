using System.Threading.Tasks;
using IdentityServer4.Services;
using IdentityServer4.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Interfaces;

namespace Todo_App.Controllers {

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly ILogger<AuthenticationController> _logger;
        private readonly IIdentityServerInteractionService _interactionService;

        public AuthenticationController(
                IAuthenticationService authenticationService,
                ILogger<AuthenticationController> logger,
                IIdentityServerInteractionService interactionService)
        {
            this._authenticationService = authenticationService;
            this._logger = logger;
            this._interactionService = interactionService;
        }

        /**
         * this method only works when login or the complete ui is separated from
         * server.
         */
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Authenticate(
                LoginData loginData
            )
        {
            // the client or ui has to send the returnUrl.
            // this method makes ids4 aware of all the parameters and values
            // in the returnUrl.
            if (!ModelState.IsValid) {
                return BadRequest();
            }

            var context = await this._interactionService
                .GetAuthorizationContextAsync(loginData.returnUrl);

            this._logger.LogInformation("context: " + context);

            var result = await this._authenticationService.Authenticate(loginData);

            if (result.Succeeded) {
                this._logger.LogInformation("user: " + loginData.Username + " has been signed." );
                return Ok(new {redirectUrl = loginData.returnUrl});
            }

            if (!result.Succeeded && result.IsLockedOut && result.IsNotAllowed)
            {
                throw new HttpResponseException {
                    Status = 500,
                    Value = new {
                        title = "User has been locked out and not allowed to sign in"
                    }
                };
            }
            if (!result.Succeeded && !result.IsLockedOut && result.IsNotAllowed)
            {
                throw new HttpResponseException {
                    Status = 500,
                    Value = new {
                        title = "User is not allowed to sign in!"
                    }
                };
            }
            if (!result.Succeeded && result.IsLockedOut && !result.IsNotAllowed)
            {
                throw new HttpResponseException {
                    Status = 500,
                    Value = new {
                        title = "User has been locked out!"
                     }
                };
            }

            return NotFound();
        }
    }
}
