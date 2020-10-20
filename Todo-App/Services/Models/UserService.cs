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

        public async Task Create(User user) {
            var result = await this._userManager
                .AddToRolesAsync(user, new List<string> {RoleConstants.USER_ROLE})
                .ContinueWith(action => this._userManager.CreateAsync(user))
                .Unwrap();

            if (!result.Succeeded)
            {
                throw new HttpResponseException
                {
                    Status = 400,
                    Value = new {
                        title = "User was not signed up"
                    }
                };
            }

            var userDbSet = this._dbcontext.Set<User>();
            var savedUser = userDbSet.Single(su => su.UserName == user.UserName);
            var todoUserSet = this._dbcontext.Set<TodoUser>();
            await todoUserSet.AddAsync(new TodoUser
            {
                UserId = savedUser.Id, // this is the key and foreign key
                UserName = savedUser.UserName
            });
            await this._dbcontext.SaveChangesAsync();

            return;
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

        public async Task<bool> IsSignedUp(string email)
        {
            var result = await this._userManager.FindByEmailAsync(email);

            if (result == null)
            {
                return false;
            }

            if (string.IsNullOrEmpty(result.Email) &&
                string.IsNullOrEmpty(result.UserName) &&
                string.IsNullOrEmpty(result.Id)
            )
            {
                return false;
            }

            return true;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await this._userManager.FindByEmailAsync(email);
            return user;
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
