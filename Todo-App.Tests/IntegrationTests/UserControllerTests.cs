using System;
using System.Data.Common;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Todo_App.DAL;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Models.Interfaces;
using Todo_App.Utils.Constants;
using Xunit;

namespace Todo_App.Tests.IntegrationTests {
    public class UserControllerTests : IClassFixture<WebApplicationFactory<Todo_App.Startup>>
    {

        private readonly WebApplicationFactory<Todo_App.Startup> _factory;
        private static DbConnection _connection;

        public UserControllerTests(WebApplicationFactory<Todo_App.Startup> factory) {
            this._factory = factory;
            _connection = CreateInMemoryDatabase();
        }

        [Fact]
        public async Task CreateUser_RegularPostRequest_UserServiceCreateUserMethodHasBeenCalled()
        {
            // this is just to make the state valid
            var mockUser = new UserVM
            {
                Password = "password", // in controller it is checked by ModelState.IsValid
                Email = "user@email.com" // in controller it is checked by ModelState.IsValid
            };

            var mockUserService = Mock.Of<IUserService>();
            var secuence = new MockSequence();
            Mock.Get(mockUserService)
                .InSequence(secuence);
                // .Setup(service => service.Create(mockUser as User, mockUser.Password))
                // .Returns(new Task(() => {Console.WriteLine("X");}));

            var client = this._factory.WithWebHostBuilder(builder =>
                {
                    builder.ConfigureTestServices(services =>
                        {
                            services.AddScoped<IUserService>(service => mockUserService);
                        });
                })
                .CreateClient();

            var content = this.GetContent<UserVM>(mockUser);
            var result = await client.PostAsync("/api/user", content);
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
            Mock.Get(mockUserService).Verify(us => us.Create(It.IsAny<User>(), It.IsAny<string>()), Times.Once());
        }

        [Fact]
        public async void CreateUser_UserIsNotValid_UserIsNotStored()
        {
            var mockUser = new UserVM
            {
                UserName = "user",
                Password = "password", // it is not a valid password
                Email = "user@email" // it is not a valid email
            };

            var client = GetHostBuilder(this._factory).CreateClient();

            var content = this.GetContent<UserVM>(mockUser);
            var result = await client.PostAsync("/api/user", content);

            var resultObject = JsonConvert
                .DeserializeObject<HttpResponseException>(result.Content.ReadAsStringAsync().Result);
            Assert.IsType<HttpResponseException>(resultObject);
            Assert.Equal(HttpStatusCode.InternalServerError, result.StatusCode);

            var selectCmd = _connection.CreateCommand();
            selectCmd.CommandText = "Select * from User where UserName = 'user'";

            using (var reader = selectCmd.ExecuteReader())
            {
                reader.Read();
                Assert.Throws<InvalidOperationException>(() => reader.GetString(reader.GetOrdinal("UserName")));
            }

            _connection.Dispose();
        }

        [Fact]
        public async void CreateUser_UserIsValid_UserIsStored()
        {
            var mockUser = new UserVM
            {
                UserName = "user",
                Password = "1Password.",
                Email = "user@email.com"
            };

            var client = GetHostBuilder(this._factory).CreateClient();

            var content = this.GetContent<UserVM>(mockUser);
            var result = await client.PostAsync("/api/user", content);
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
            var selectCmd = _connection.CreateCommand();
            selectCmd.CommandText = "Select * from User where UserName = 'user'";

            using (var reader = selectCmd.ExecuteReader())
            {
                reader.Read();
                Assert.Equal("user", reader.GetString(reader.GetOrdinal("UserName")));
            }

            selectCmd.CommandText = $"Select * from Role where Name = '{RoleConstants.USER_ROLE}'";
            using (var reader = selectCmd.ExecuteReader())
            {
                reader.Read();
                Assert.Equal(RoleConstants.USER_ROLE, reader.GetString(reader.GetOrdinal("Name")));
            };

            _connection.Dispose();
        }

        //
        // Summary:
        //      returns a WebApplicationFactory with out mocked services
        //
        private static WebApplicationFactory<Startup> GetHostBuilder(WebApplicationFactory<Todo_App.Startup> factory)
        {
            return factory
                .WithWebHostBuilder(builder =>
                    {
                        builder.ConfigureTestServices(services =>
                            {
                                var descriptor = services.SingleOrDefault(d =>
                                          d.ServiceType == typeof(DbContextOptions<IdDbContext>));

                                services.Remove(descriptor);

                                services.AddDbContext<IdDbContext>(options =>
                                      {
                                          options.UseSqlite(_connection);
                                      });

                                var sp = services.BuildServiceProvider();

                                using (var scope = sp.CreateScope())
                                {
                                    var scopedServices = scope.ServiceProvider;
                                    var logger = scopedServices
                                        .GetRequiredService<ILogger<UserControllerTests>>();

                                    try
                                    {
                                        var context = scopedServices
                                            .GetRequiredService<IdDbContext>();
                                        var roleManager = scopedServices
                                            .GetRequiredService<RoleManager<Role>>();

                                        DataSeedingContext.Initialize(context, roleManager);
                                    }
                                    catch(Exception ex)
                                    {
                                        logger.LogError(ex, "An Error ocurred seeding the" +
                                            "database with test messages. Error: {Message}", ex.Message);
                                    }
                                }
                            });
                    });
        }

        private static DbConnection CreateInMemoryDatabase()
        {
            var connection = new SqliteConnection("Filename=:memory:");
            connection.Open();
            return connection;
        }

        // this will serialize object to JSON
        private StringContent GetContent<T>(T mock)
        {
            var json = JsonConvert.SerializeObject(mock);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            return content;
        }
    }
}
