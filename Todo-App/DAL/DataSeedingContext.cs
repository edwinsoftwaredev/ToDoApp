using System;
using System.Collections.Generic;
using System.Linq;
using IdentityServer4;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Todo_App.Model.Auth;
using Todo_App.Utils.Constants;

namespace Todo_App.DAL
{
    public static class DataSeedingContext
    {
        public static void Initialize(IdDbContext context,
                RoleManager<Role> roleManager,
                ConfigurationDbContext configurationDbContext)
        {

            /**
             * How to:
             * First generate the migration IF THERE IS A CHANGE IN THE MODEL,
             * if what its needed it just seeding the database generate a new migration
             * is not something to do.
             *
             * Second just start the server. That will migrate the database if it is needed
             * and will seed the database.
             *
             * in production with many instances running this type of code can cause
             * problems, Read 'apply-migrations-at-runtime':
             * https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/applying
             *
             * THIS IS A MIGRATION AT RUNTIME
             **/

            // use code with precaution
            context.Database.Migrate();

            if (!context.Roles.Any())
            {
                // seeding database
                var result = roleManager.CreateAsync(new Role
                       {
                          Name = RoleConstants.USER_ROLE,
                          NormalizedName = RoleConstants.USER_ROLE
                       }).Result;

                if (!result.Succeeded)
                    throw new Exception("An Error occurred when creating the DB");
            }

            if (!configurationDbContext.Clients.Any())
            {
                var firstPartyUserClient = new IdentityServer4.Models.Client
                {
                    ClientId = "TodoAppFirstPartyUser",
                    ClientName = "Todo App First Party - User",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequireClientSecret = false, // default is true
                    RequirePkce = true, // default is false
                    AllowPlainTextPkce = false, // default is false
                    RequireConsent = false, // this is a firstParty client
                    PostLogoutRedirectUris = {
                        "https://localhost:5001/authentication/signout"
                    },
                    AllowedScopes =
                    {
                        "TodoAppApi.TodoAppUser", // This is name of an ApiResource scope
                        IdentityServerConstants.LocalApi.ScopeName,
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile
                    },
                    RedirectUris = new List<string>
                    {
                        "https://localhost:5001/auth/codes"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:5001"
                    }
                }.ToEntity();

                configurationDbContext.Clients.Add(firstPartyUserClient);
                configurationDbContext.SaveChanges();
            }

            if(!configurationDbContext.ApiResources.Any())
            {
                var apiResource = new IdentityServer4.Models.ApiResource
                {
                    Name = "TodoAppApi",
                    Scopes =
                    {
                        new Scope
                        {
                            Name = "TodoAppApi.TodoApp",
                            DisplayName = "Full access to TodoApp"
                        },
                        new Scope
                        {
                            Name = "TodoAppApi.TodoAppUser",
                            DisplayName = "User access TodoApp"
                        }
                    }
                }.ToEntity();

                var localApiResource =
                    new IdentityServer4.
                        Models
                        .ApiResource(IdentityServerConstants.LocalApi.ScopeName).ToEntity();

                configurationDbContext.ApiResources.Add(apiResource);
                configurationDbContext.ApiResources.Add(localApiResource);
                configurationDbContext.SaveChanges();
            }

            return;
        }
    }
}
