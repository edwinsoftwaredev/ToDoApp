using System.Threading.Tasks;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Interfaces;
using Google.Apis.Auth;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Todo_App.Services.Models.Interfaces;
using Todo_App.Model.Auth;
using System.Linq;

/*
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
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AuthenticationController(
                IAuthenticationService authenticationService,
                ILogger<AuthenticationController> logger,
                IIdentityServerInteractionService interactionService,
                IUserService userService,
                IConfiguration configuration)
        {
            _authenticationService = authenticationService;
            _logger = logger;
            _interactionService = interactionService;
            _userService = userService;
            _configuration = configuration;
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
                        title = "User is not allowed to sign in."
                    }
                };
            }
            if (!result.Succeeded && result.IsLockedOut && !result.IsNotAllowed)
            {
                throw new HttpResponseException {
                    Status = 500,
                    Value = new {
                        title = "User has been locked out."
                     }
                };
            }

            return NotFound();
        }

        [HttpPost("signin-google")]
        [AllowAnonymous]
        public async Task<IActionResult> SignInGoogle(GoogleIDToken googleIDToken)
        {
            if (string.IsNullOrEmpty(googleIDToken.Id_Token))
            {
                this._logger.LogInformation(googleIDToken.Id_Token);
                return BadRequest();
            }
            
            var validationSettings = new GoogleJsonWebSignature.ValidationSettings();
            validationSettings.Audience = new List<string> {_configuration["Authentication_Google_ClientId"]
            };

            var result = await GoogleJsonWebSignature
                .ValidateAsync(googleIDToken.Id_Token, validationSettings);

            var isSignedUp = await this._userService.IsSignedUp(result.Email);

            if (isSignedUp)
            {
                var user = await this._userService.GetUserByEmail(result.Email);

                if (user == null)
                {
                    return NotFound(new {message = "User not found when sign in"});
                }

                var authResult = await this._authenticationService.AuthenticateByUser(user);

                if (!authResult.Succeeded)
                {
                    return BadRequest(new {message="User was not signed in"});
                }

                return Ok(new {redirectUrl=googleIDToken.returnUrl});
            }
            else
            {
                var newUser = new User {
                    Email = result.Email,
                    Name = result.Name,
                    UserName = result.Email.Split('@').First()
                };

                await this._userService.Create(newUser);

                var user = await this._userService.GetUserByEmail(newUser.Email);

                if (user == null)
                {
                    return NotFound(new {message="User was not found when sign in"});
                }

                var authResult = await this._authenticationService.AuthenticateByUser(user);

                if (!authResult.Succeeded)
                {
                    return BadRequest(new {message="It wasn't possible to sign in the user."});
                }

                return Ok(new {redirectUrl=googleIDToken.returnUrl});
            }
        }

        [HttpPost("signout")]
        public async Task<IActionResult> SignOut(LogoutData logoutData)
        {
            if (User?.Identity.IsAuthenticated == true)
            {
                var postLogoutRedirect = await this._authenticationService.SignOut(logoutData.LogoutId);
                return Ok(postLogoutRedirect);
            }

            return BadRequest();
        }
    }
    
    public class LogoutData
    {
        public string LogoutId { get; set; }
    }
    
    public class GoogleIDToken
    {
        public string returnUrl { get; set; }
        public string Id_Token { get; set; }
    }
}
