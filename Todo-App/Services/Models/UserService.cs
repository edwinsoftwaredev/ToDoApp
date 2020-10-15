using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Todo_App.Model.Auth;
using System.Threading.Tasks;
using System;
using Todo_App.Services.Models.Interfaces;
using Todo_App.Utils;
using Todo_App.Utils.Constants;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Todo_App.DAL;
using Todo_App.Model.TodoRest;
using System.Linq;

namespace Todo_App.Services.Models
{
    public class UserService : IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly IIdentityServerInteractionService _identityServerInteractionService;
        private readonly IHttpContextAccessor _httpContextAcessor;
        private readonly IdDbContext _dbcontext;

        public UserService(UserManager<User> userManager,
                IIdentityServerInteractionService identityServerInteractionService,
                IHttpContextAccessor httpContextAccessor,
                IdDbContext dbContext)
        {
            _userManager = userManager;
            _identityServerInteractionService = identityServerInteractionService;
            _httpContextAcessor = httpContextAccessor;
            _dbcontext = dbContext;
        }

        public Task Create(User user) {
            throw new NotImplementedException();
        }

        public async Task Create(User user, string password)
        {
            // https://www.jerriepelser.com/blog/check-for-spammy-email-when-registering-user/

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

            // adding a new TodoUser
            var userDbSet = this._dbcontext.Set<User>();
            var savedUser = userDbSet.Single(su => su.UserName == user.UserName);
            var todoUserSet = this._dbcontext.Set<TodoUser>();
            await todoUserSet.AddAsync(new TodoUser
            {
                UserId = savedUser.Id, // this is the key and foreign key
                UserName = savedUser.UserName
            });
            await this._dbcontext.SaveChangesAsync();


            // Here I have to add authentication features, like:
            // Token Email Confirmation, Password Recovery, Google, Facebook, Microsoft, Twitter
            // 2FA or MFA. And other options
            return;
        }

        public Task Create(User user, string password, List<string> roles)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetCurrentUser() {
            return this._userManager
                .GetUserAsync(this._httpContextAcessor.HttpContext.User);
        }

        public Task Update(User user) {
            throw new NotImplementedException();
        }

        public Task Delete(string userName) {
            throw new NotImplementedException();
        }
    }
}
