using System;
using System.Collections.Generic;
using System.Linq;
using IdentityServer4;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.Models;
using IdentityServer4.Stores;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using IdentityResource = IdentityServer4.EntityFramework.Entities.IdentityResource;

namespace Todo_App.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger,
                IConfigurationDbContext configurationDbContext,
                ISigningCredentialStore credentialStore)
        {
            _logger = logger;

            // this.AddClients(configurationDbContext);
            // this.AddIdentityResources(configurationDbContext);
            // this.AddApiResources(configurationDbContext);
            // this.EditClient(configurationDbContext, 6);
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
                {
                    Date = DateTime.Now.AddDays(index),
                    TemperatureC = rng.Next(-20, 55),
                    Summary = Summaries[rng.Next(Summaries.Length)]
                })
                .ToArray();
        }

        private void EditClient(IConfigurationDbContext configurationDbContext, int clientId)
        {
            // configurationDbContext.Clients
            // .Include(client => client.AllowedGrantTypes).First(client => client.Id == clientId)
            //     .AllowedGrantTypes.RemoveAll(grantType => true);

            var client = configurationDbContext.Clients
                .First(client => client.Id == clientId);

            // client.AllowedGrantTypes = new List<ClientGrantType>
            // {
            //     new ClientGrantType
            //     {
            //         ClientId = client.Id,
            //         GrantType = GrantType.AuthorizationCode
            //     }
            // };

            var allowedCorsOrigins = configurationDbContext.Clients
                // .Include(client => client.AllowedCorsOrigins)
                // .Include(client => client.RedirectUris)
                .Include(client => client.AllowedScopes)
                .First(client => client.Id == clientId);

            allowedCorsOrigins
                .AllowedScopes
                .First(scope => scope.Scope == "TodoAppApi")
                .Scope = "TodoAppApi.TodoAppUser";

            /* allowedCorsOrigins.AllowedCorsOrigins
                .AddRange(
                 new List<ClientCorsOrigin>
                    {
                       new ClientCorsOrigin
                       {
                           ClientId = client.Id,
                           Origin = "https://localhost:5001"
                       },
                       new ClientCorsOrigin
                       {
                           ClientId = client.Id,
                           Origin = "http://localhost:4200"
                       },
                       new ClientCorsOrigin
                       {
                           ClientId = client.Id,
                           Origin = "http://localhost:9876"
                       }
                    }
                );
                */

            /*allowedCorsOrigins.RedirectUris.Add(new ClientRedirectUri {
                    ClientId = client.Id,
                    RedirectUri = "http://localhost:9876/auth/codes"
                });*/

            configurationDbContext.SaveChanges();
        }

        private void AddClients(IConfigurationDbContext configurationDbContext)
        {

            // Removing client -- TodoAppFirstPartyUser
            var clientToRemove = configurationDbContext.Clients.AsNoTracking().FirstOrDefault(x => x.ClientId == "TodoAppFirstPartyUser");
            var x = clientToRemove != null ? configurationDbContext.Clients.Remove(clientToRemove) : null;

            configurationDbContext.SaveChanges();

            if (x != null && (x.State != EntityState.Deleted && x.State != EntityState.Detached))
            {
                throw new DbUpdateException($"Current State: {x.State}");
            }

            // Creating new client
            var firstPartyUserClient = new IdentityServer4.Models.Client
            {
                ClientId = "TodoAppFirstPartyUser",
                ClientName = "Todo App First Party - User",
                AllowedGrantTypes = GrantTypes.Code,
                RequireClientSecret = false, // default is true
                RequirePkce = true, // default is false
                AllowPlainTextPkce = false, // default is false
                AllowedScopes =
                {
                    "TodoAppApi.TodoAppUser", // This is name of an ApiResource scope
                    IdentityServerConstants.StandardScopes.OpenId,
                    IdentityServerConstants.StandardScopes.Profile
                },
                RedirectUris = new List<string>
                {
                    "http://localhost:4200/auth/codes",
                    "https://localhost:5100/auth/codes"
                }
            }.ToEntity();

            configurationDbContext.Clients.Add(firstPartyUserClient);
            configurationDbContext.SaveChanges();
        }

        private void AddIdentityResources(IConfigurationDbContext configurationDbContext)
        {
            var manualIdentityResourcesApi = new List<IdentityResource>
            {
                new IdentityResources.OpenId().ToEntity(),
                new IdentityResources.Profile().ToEntity(),
                new IdentityResources.Address().ToEntity(),
                new IdentityResources.Email().ToEntity(),
                new IdentityResources.Phone().ToEntity()
            };

            configurationDbContext.IdentityResources.AddRange(manualIdentityResourcesApi);
            configurationDbContext.SaveChanges();
        }

        private void AddApiResources(IConfigurationDbContext configurationDbContext)
        {
            var manualApiResourceData = new List<IdentityServer4.EntityFramework.Entities.ApiResource>
            {
                new IdentityServer4.Models.ApiResource
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

                    // we are not including the api secret since by default IdentityServer
                    // configure JWT to protect API, but there is other technique that
                    // uses reference tokens. In this case the API, which IdentityServer is protecting and
                    // register with an ApiSecret, receives a token identifier by the Client, which requests first
                    // to IdentityServer the token identifier and set client.AccessTokenType = AccessTokenType.Reference;,
                    // then the API send to IdentityServer the token identifier to verify or authorize the access by Client.
                    //
                    // Reference: https://identityserver4.readthedocs.io/en/latest/topics/reference_tokens.html
                    //            https://identityserver4.readthedocs.io/en/latest/topics/apis.html
                    //
                }.ToEntity()
            };

            configurationDbContext.ApiResources.AddRange(manualApiResourceData);
            configurationDbContext.SaveChanges();
        }
    }
}
