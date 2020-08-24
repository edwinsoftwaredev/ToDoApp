using System.Data.Common;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Newtonsoft.Json;
using Todo_App.DAL;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Models.Interfaces;
using Xunit;

namespace Todo_App.Tests.IntegrationTests {
    public class UserControllerTests : IClassFixture<WebApplicationFactory<Todo_App.Startup>>
    {

        private readonly WebApplicationFactory<Todo_App.Startup> _factory;

        public UserControllerTests(WebApplicationFactory<Todo_App.Startup> factory) {
            this._factory = factory;
        }

        /*[Fact]
        public async Task CreateUser_UserNotValid_NotSuccessful()
        {
            var userStateNotValid = new UserVM {};

            var userValue = It.IsAny<User>();
            var passwordValue = It.IsAny<string>();

            var mockUserService = new Mock<IUserService>();

            mockUserService.Setup(userService => userService.Create(userStateNotValid as User, userStateNotValid.Password))
                .Returns(() => Task.Factory.StartNew(() => {Console.WriteLine("X");}));

            var client = this._factory.WithWebHostBuilder(builder =>
                {
                    builder.ConfigureTestServices(services =>
                    {
                        services.AddScoped(mockUserService.Object.GetType());
                    });
                })
                .CreateClient();

            var content = this.GetContent<UserVM>(userStateNotValid);
            var result = await client.PostAsync("/api/user", content);
            Assert.False(result.IsSuccessStatusCode);
            mockUserService.Verify(userService => userService.Create(It.IsAny<User>(), It.IsAny<string>()), Times.Never());
        }*/

        /*
         * this test if the ModelState is valid or not
         * Test if a model is valid or ModelState is valid is only possible with
         * an Integration Test ModelState is ASPNETCOREMVC
         **/
        /*[Fact]
        public async Task CreateUser_PasswordOfInvalidLength_NotSuccessful()
        {
            // password must have at least 6 characters
            var mockUser = new UserVM {
                Password = "none"
            };

            var mockUserService = Mock.Of<IUserService>(MockBehavior.Strict);
            var secuence = new MockSequence();
            Mock.Get(mockUserService)
                .InSequence(secuence)
                .Setup(service => service.Create(mockUser as User, mockUser.Password))
                .Returns(new Task(() => {Console.WriteLine("X");}));

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
            Assert.False(result.IsSuccessStatusCode);
            Mock.Get(mockUserService).Verify(userService => userService.Create(It.IsAny<User>(), It.IsAny<string>()), Times.Never());
        }*/

        [Fact]
        public async Task CreateUser_RegularPostRequest_UserServiceCreateUserMethodHasBeenCalled()
        {
            // this is just to make the state valid
            var mockUser = new UserVM
            {
                Password = "password"
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
                Password = "password"
            };

            var _connection = CreateInMemoryDatabase();
            var client = this._factory.WithWebHostBuilder(builder =>
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

                        });
                }).CreateClient();

            var content = this.GetContent<UserVM>(mockUser);
            var result = await client.PostAsync("/api/user", content);
            var resultObject = JsonConvert
                .DeserializeObject<HttpResponseException>(result.Content.ReadAsStringAsync().Result);
            Assert.IsType<HttpResponseException>(resultObject);
            Assert.Equal(HttpStatusCode.InternalServerError, result.StatusCode);
            _connection.Dispose();
        }

        [Fact]
        public async void CreateUser_UserIsValid_UserIsStored()
        {
            var mockUser = new UserVM
            {
                UserName = "user",
                Password = "1Password."
            };

            var _connection = CreateInMemoryDatabase();
            var client = this._factory
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
                                });
                    }).CreateClient();

            var content = this.GetContent<UserVM>(mockUser);
            var result = await client.PostAsync("/api/user", content);
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
            /*var selectCmd =_connection.CreateCommand();
            selectCmd.CommandText = "Select * from User where UserName = 'user'";
            using (var reader = selectCmd.ExecuteReader())
            {
                reader.Read();
                Assert.Equal("user", reader.GetString(reader.GetOrdinal("UserName")));
            }*/
            _connection.Dispose();
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
