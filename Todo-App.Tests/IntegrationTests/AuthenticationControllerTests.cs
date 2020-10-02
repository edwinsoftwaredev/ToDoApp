using System;
using System.Data.Common;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Todo_App.DAL;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;
using Xunit;

namespace  Todo_App.Tests.IntegrationTests
{
    public class AuthenticationControllerTests :
        IClassFixture<WebApplicationFactory<Todo_App.Startup>>
    {
        private readonly WebApplicationFactory<Todo_App.Startup> _factory;
        private static DbConnection _dbConnection;

        public AuthenticationControllerTests(
                WebApplicationFactory<Todo_App.Startup> factory)
        {
            this._factory = factory;
            _dbConnection = CreateInMemoryDatabase();
            SaveUser();
        }

        [Fact]
        public async Task SignIn_LoginDataIsCorrect_Ok()
        {
            var client = GetHostBuilder(this._factory).CreateClient();
            var content = this.GetContent<LoginData>(new LoginData {
                Username = "user",
                Password = "1Password.",
                returnUrl = ""
            });
            var xsrfRequest = await client.GetAsync("/api/xsrftoken");
            var resultCookies = xsrfRequest.Headers.GetValues("Set-Cookie").ToArray();
            var xsrftoken = Array
                .Find<string>(resultCookies, cookie => cookie.StartsWith("X-XSRF-TOKEN"));
            xsrftoken = xsrftoken.Split("=")[1].Split(";")[0];
            client.DefaultRequestHeaders.Add("x-xsrf-token", xsrftoken);
            var result = await client.PostAsync("/api/authentication/signin", content);

            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
        }

        [Fact]
        public async Task SignIn_LoginDataEmpty_BadRequest()
        {
            var client = GetHostBuilder(this._factory).CreateClient();
            var content = this.GetContent<LoginData>(new LoginData {
                Username = "",
                Password = "",
                returnUrl = ""
            });
            var xsrfRequest = await client.GetAsync("/api/xsrftoken");
            var resultCookies = xsrfRequest.Headers.GetValues("Set-Cookie").ToArray();
            var xsrftoken = Array
                .Find<string>(resultCookies, cookie => cookie.StartsWith("X-XSRF-TOKEN"));
            xsrftoken = xsrftoken.Split("=")[1].Split(";")[0];
            client.DefaultRequestHeaders.Add("x-xsrf-token", xsrftoken);
            var result = await client.PostAsync("/api/authentication/signin", content);

            Assert.Equal(HttpStatusCode.BadRequest, result.StatusCode);
        }

        [Fact]
        public async Task SignIn_UsenameWrong_NotFound()
        {
            var client = GetHostBuilder(this._factory).CreateClient();
            var content = this.GetContent<LoginData>(new LoginData {
                Username = "testuser",
                Password = "1Password.",
                returnUrl = ""
            });
            var xsrfRequest = await client.GetAsync("/api/xsrftoken");
            var resultCookies = xsrfRequest.Headers.GetValues("Set-Cookie").ToArray();
            var xsrftoken = Array
                .Find<string>(resultCookies, cookie => cookie.StartsWith("X-XSRF-TOKEN"));
            xsrftoken = xsrftoken.Split("=")[1].Split(";")[0];
            client.DefaultRequestHeaders.Add("x-xsrf-token", xsrftoken);
            var result = await client.PostAsync("/api/authentication/signin", content);

            Assert.Equal(HttpStatusCode.NotFound, result.StatusCode);
        }

        /**
         * this is the last test therefore the _dbConnection is closed
         * in this test.
         */
        [Fact]
        public async Task SignIn_PasswordWrong_NotFound()
        {
            var client = GetHostBuilder(this._factory).CreateClient();
            var content = this.GetContent<LoginData>(new LoginData {
                Username = "user",
                Password = "1Password",
                returnUrl = ""
            });
            var xsrfRequest = await client.GetAsync("/api/xsrftoken");
            var resultCookies = xsrfRequest.Headers.GetValues("Set-Cookie").ToArray();
            var xsrftoken = Array
                .Find<string>(resultCookies, cookie => cookie.StartsWith("X-XSRF-TOKEN"));
            xsrftoken = xsrftoken.Split("=")[1].Split(";")[0];
            client.DefaultRequestHeaders.Add("x-xsrf-token", xsrftoken);
            var result = await client.PostAsync("/api/authentication/signin", content);

            Assert.Equal(HttpStatusCode.NotFound, result.StatusCode);

            _dbConnection.Dispose();
        }

        private async void SaveUser()
        {
            var mockUser = new UserVM
            {
                UserName = "user",
                Password = "1Password.",
                Email = "user@email.com"
            };

            var client = GetHostBuilder(this._factory).CreateClient();

            var content = this.GetContent<UserVM>(mockUser);
            var xsrfRequest = await client.GetAsync("/api/xsrftoken");
            var resultCookies = xsrfRequest.Headers.GetValues("Set-Cookie").ToArray();
            var xsrftoken = Array
                .Find<string>(resultCookies, cookie => cookie.StartsWith("X-XSRF-TOKEN"));
            xsrftoken = xsrftoken.Split("=")[1].Split(";")[0];

            client.DefaultRequestHeaders.Add("x-xsrf-token", xsrftoken);
            var result = await client.PostAsync("/api/user", content);
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
                            .GetRequiredService<ILogger<AuthenticationControllerTests>>();

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

        // this will serialize object to JSON
        private StringContent GetContent<T>(T mock)
        {
            var json = JsonConvert.SerializeObject(mock);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            return content;
        }

        private static DbConnection CreateInMemoryDatabase()
        {
            var connection = new SqliteConnection("Filename=:memory:");
            connection.Open();

            return connection;
        }
    }
}
