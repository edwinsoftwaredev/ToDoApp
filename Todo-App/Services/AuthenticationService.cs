using System;
using System.Threading.Tasks;
using IdentityServer4;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;
using IAuthenticationService = Todo_App.Services.Interfaces.IAuthenticationService;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Todo_App.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        readonly SignInManager<User> _signInManager;
        readonly ILogger<AuthenticationService> _logger;
        readonly IHttpContextAccessor _httpContextAcessor;
        readonly IIdentityServerInteractionService _interactionService;

        public AuthenticationService(
                SignInManager<User> signInManager,
                ILogger<AuthenticationService> logger,
                IHttpContextAccessor httpContextAccessor,
                IIdentityServerInteractionService interactionService
            )
        {
            _signInManager = signInManager;
            _logger = logger;
            _httpContextAcessor = httpContextAccessor;
            _interactionService = interactionService;
        }

        // https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity
        public async Task<SignInResult> Authenticate(LoginData loginData)
        {

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

            this._logger.LogInformation("An attemp to sign in user: " + loginData.Username + " was executed.");

            return result;
        }

        public async Task<SignInResult> AuthenticateByUser(User user)
        {
            if (this._signInManager.IsSignedIn(this._httpContextAcessor.HttpContext.User))
            {
                return SignInResult.Failed;
            }

            try
            {
                // change flag to true
                await this._signInManager.SignInAsync(user, false, "GoogleSignIn");
                return SignInResult.Success;
            }
            catch(Exception)
            {
                return SignInResult.Failed;
            }
        }

        public async Task<string> SignOut(string logoutId)
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("User logged out.");
            
            var result = await _interactionService.GetLogoutContextAsync(logoutId);
            
            return result.PostLogoutRedirectUri;
        }
    }
}
