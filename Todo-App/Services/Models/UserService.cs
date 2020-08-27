using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Todo_App.Model.Auth;
using System.Threading.Tasks;
using System;
using Todo_App.Services.Models.Interfaces;
using Todo_App.Utils;
using Todo_App.Utils.Constants;
using System.Collections.Generic;

namespace Todo_App.Services.Models
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly IIdentityServerInteractionService _identityServerInteractionService;

        public UserService(UserManager<User> userManager,
                IIdentityServerInteractionService identityServerInteractionService) : base()
        {
            _userManager = userManager;
            _identityServerInteractionService = identityServerInteractionService;
        }

        public Task Create(User user) {
            throw new NotImplementedException();
        }

        public async Task Create(User user, string password)
        {
            var userValidator = new UserValidator<User>();
            userValidator.Describer.InvalidEmail(user.Email);
            this._userManager.UserValidators.Add(userValidator);

            if (!RegexUtilities.IsValidEmail(user.Email))
                throw new HttpResponseException
                {
                    Status = 500,
                    Value = new {
                        title = "Error creating user"
                    }
                };

            var result = await this._userManager
                .AddToRolesAsync(user, new List<string> {RoleConstants.USER_ROLE})
                .ContinueWith(a => this._userManager.CreateAsync(user, password))
                .Unwrap();

            if (!result.Succeeded)
                throw new HttpResponseException
                {
                    Status = 500,
                    Value = new {
                        title = "Error creating user"
                    }
                };
            // Here I have to add authentication features, like:
            // Token Email Confirmation, Password Recovery, Google, Facebook, Microsoft, Twitter
            // 2FA or MFA. And other options
            return;
        }

        public Task Create(User user, string password, List<string> roles)
        {
            throw new NotImplementedException();
        }

        public Task Get(string userName) {
            throw new NotImplementedException();
        }

        public Task Update(User user) {
            throw new NotImplementedException();
        }

        public Task Delete(string userName) {
            throw new NotImplementedException();
        }
    }
}
