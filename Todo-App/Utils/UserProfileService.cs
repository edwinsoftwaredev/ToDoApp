using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Google.Apis.Logging;
using IdentityModel;
using IdentityServer4.Models;
using IdentityServer4.Services;
using Microsoft.Extensions.Logging;
using Todo_App.DAL;
using Todo_App.Model.Auth;

namespace Todo_App.Utils
{
    public class UserProfileService : IProfileService
    {
        private readonly IdDbContext _dbcontext;
        private readonly ILogger<UserProfileService> _logger;

        public UserProfileService(
                IdDbContext dbContext,
                ILogger<UserProfileService> logger
        )
        {
            this._dbcontext = dbContext;
            this._logger = logger;
        }

        public virtual Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            context.LogProfileRequest(this._logger);
            if (context.RequestedClaimTypes.Any())
            {
                var userSet = this._dbcontext.Set<User>();
                var subject =
                    context.Subject.FindFirst(JwtClaimTypes.Subject);

                if (subject == null )
                    throw new InvalidOperationException("sub claim is missing");

                var user = userSet
                    .SingleOrDefault(user =>
                        user.Id == subject.Value
                    );

                if (user != null)
                {
                    var extraClaims = new List<Claim>
                    {
                        // this will add userName to name
                        new Claim("preferred_username", user.UserName),
                    };
                    context.AddRequestedClaims(extraClaims);
                }
            }

            context.LogIssuedClaims(this._logger);

            return Task.CompletedTask;
        }

        public virtual Task IsActiveAsync(IsActiveContext context)
        {
            this._logger.LogDebug("IsActive called from: {}", context.Caller);

            var userSet = this._dbcontext.Set<User>();
            var subject =
                context.Subject.FindFirst(JwtClaimTypes.Subject);

            if (subject == null )
                throw new InvalidOperationException("sub claim is missing");

            var user = userSet.SingleOrDefault(user => user.Id == subject.Value);

            // user should have an isActive Property
            // and validate with that property instead of
            // the one used(LockoutEnd).
            context.IsActive = user?.LockoutEnd != null;

            return Task.CompletedTask;
        }
    }
}
