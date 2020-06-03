using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Todo_App.Model.Auth;

namespace Todo_App.Controllers.Auth
{
    [Authorize]
    public class UserController : ControllerBase
    {
        readonly UserManager<User> _userManager;
        readonly IIdentityServerInteractionService _interactionService;
        
        public UserController(
            UserManager<User> userManager,
            IIdentityServerInteractionService interactionService
            )
        {
            _userManager = userManager;
            _interactionService = interactionService;
        }

        // [HttpPost]
        // [AllowAnonymous]
        // public async Task<IActionResult> CreateUser(User user)
        // {
        //     string x = "x";
        // }
    }
}