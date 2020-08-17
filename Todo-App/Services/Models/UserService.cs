using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Todo_App.Model.Auth;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Todo_App.Services.Models
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

        public async Task CreateUser(User user, string password)
        {
            var result = await this._userManager.CreateAsync(user, password);

            if (result.Succeeded) {
                // Here I have to add authentication features, like:
                // Token Email Confirmation, Password Recovery, Google, Facebook, Microsoft, Twitter
                // 2FA or MFA. And other options
            } else {
                throw new HttpResponseException
                {
                    Status = 500,
                    Value = new {
                        title = "Error creating user"
                    }
                };
            }
        }
    }
}
