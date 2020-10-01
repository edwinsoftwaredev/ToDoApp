using System.Threading.Tasks;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Interfaces;

/**
 * This Controllers is based on the configuration of the following resources:
 *
 * https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity
 * https://identityserver4.readthedocs.io/en/latest/topics/signout.html
 * https://github.com/IdentityServer/IdentityServer4.Quickstart.UI/blob/main/Quickstart/Account/AccountController.cs
 * https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.identity.signinmanager-1?view=aspnetcore-3.1
 */
namespace Todo_App.Controllers {

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [ValidateAntiForgeryToken]
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
        [HttpPost("signin")]
        [AllowAnonymous]
        public async Task<IActionResult> SignIn(
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

        [HttpPost("signout")]
        public async Task<IActionResult> SignOut()
        {
            if (User?.Identity.IsAuthenticated == true)
            {
                await this._authenticationService.SignOut();
                return Ok();
            }

            return BadRequest();
        }
    }
}
