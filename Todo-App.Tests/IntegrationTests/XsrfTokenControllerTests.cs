using System;
using System.Data.Common;
using System.Linq;
using System.Net;
using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Todo_App.DAL;
using Todo_App.Model.Auth;
using Xunit;

namespace Todo_App.Tests.IntegrationTests
{
    public class XsrfTokenControllerTests :
        IClassFixture<WebApplicationFactory<Todo_App.Startup>>
    {
        private readonly WebApplicationFactory<Todo_App.Startup> _factory;
        private static DbConnection _dbConnection;


        public XsrfTokenControllerTests(
           WebApplicationFactory<Todo_App.Startup> factory
        )
        {
            this._factory = factory;
            _dbConnection = CreateInMemoryDatabase();
        }


        [Fact]
        public async void GetToken_callGetToken_TokenReturned()
        {
            var client = GetHostBuilder(this._factory).CreateClient();

            var result = await client.GetAsync("/api/xsrftoken");

            Assert.Equal(HttpStatusCode.NoContent, result.StatusCode);
        }

        [Fact]
        public async void GetToken_callGetToken_XsrfCookieIsSended()
        {
            var client = GetHostBuilder(this._factory).CreateClient();

            var result = await client.GetAsync("/api/xsrftoken");

            var resultCookies = result.Headers.GetValues("Set-Cookie").ToArray();
            var xsrftoken = Array
                .Find<string>(resultCookies, cookie => cookie.StartsWith("X-XSRF-TOKEN"));
            xsrftoken = xsrftoken.Split("=")[1].Split(";")[0];

            Assert.NotNull(xsrftoken);
        }

        private static WebApplicationFactory<Startup> GetHostBuilder(
                WebApplicationFactory<Todo_App.Startup> factory)
        {
            return factory.WithWebHostBuilder(configuration =>
                configuration.ConfigureTestServices(servicesConfiguration =>
                {
                    var descriptor = servicesConfiguration
                        .SingleOrDefault(service =>
                            service.ServiceType == typeof(DbContextOptions<IdDbContext>));

                    servicesConfiguration.Remove(descriptor);

                    servicesConfiguration.AddDbContext<IdDbContext>(options =>
                        options.UseSqlite(_dbConnection)
                    );

                    var serviceProvider = servicesConfiguration.BuildServiceProvider();

                    using(var scope = serviceProvider.CreateScope())
                    {
                        var resolver = scope.ServiceProvider;
                        var logger = resolver
                            .GetRequiredService<ILogger<XsrfTokenControllerTests>>();

                        try
                        {
                            var dbContext =  resolver.GetRequiredService<IdDbContext>();
                            var roleManager = resolver.GetRequiredService<RoleManager<Role>>();
                            var configDbContext = resolver.GetRequiredService<ConfigurationDbContext>();

                            DataSeedingContext.Initialize(dbContext,
                                    roleManager,
                                    configDbContext);
                        }
                        catch(Exception e)
                        {
                            logger.LogError(e, "An Error ocurred seeding the" +
                                "database with test messages. Error: {Message}", e.Message);
                        }
                    }
                })
            );
        }


        private static DbConnection CreateInMemoryDatabase()
        {
            var connection = new SqliteConnection("Filename=:memory:");
            connection.Open();

            return connection;
        }
    }
}

