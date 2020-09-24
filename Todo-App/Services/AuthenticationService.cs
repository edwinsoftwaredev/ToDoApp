using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Interfaces;

namespace Todo_App.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        readonly SignInManager<User> _signInManager;
        readonly ILogger<AuthenticationService> _logger;
        readonly IHttpContextAccessor _httpContextAcessor;

        public AuthenticationService(
                SignInManager<User> signInManager,
                ILogger<AuthenticationService> logger,
                IHttpContextAccessor httpContextAccessor
            )
        {
            this._signInManager = signInManager;
            this._logger = logger;
            this._httpContextAcessor = httpContextAccessor;
        }

        // https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity
        public async Task<SignInResult> Authenticate(LoginData loginData)
        {
            this._logger.LogInformation("An attemp to sign in user: " + loginData.Username + " was executed.");

            if (this._signInManager.IsSignedIn(this._httpContextAcessor.HttpContext.User))
            {
                return SignInResult.Failed;
            }

            var result = await this._signInManager
                .PasswordSignInAsync(
                        loginData.Username,
                        loginData.Password,
                        true,
                        true
                    );

            return result;
        }
    }
}
