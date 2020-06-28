using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Todo_App.Model.Auth;
using Todo_App.Services.Models;

namespace Todo_App.Services
{
    public class UserService : BaseModelsService<User>
    {

        private readonly UserManager<User> _userManager;
        private readonly IIdentityServerInteractionService _identityServerInteractionService;

        public UserService(UserManager<User> userManager,
            IIdentityServerInteractionService identityServerInteractionService) : base()
        {
            _userManager = userManager;
            _identityServerInteractionService = identityServerInteractionService;
        }

        public void CreateUser(User user)
        {

        }
    }
}
