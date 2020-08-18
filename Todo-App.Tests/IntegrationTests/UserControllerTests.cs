using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Newtonsoft.Json;
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

        [Fact]
        public async Task CreateUser_UserNotValid_NotSuccessful()
        {
            var userStateNotValid = new UserVM {};

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

            var json = JsonConvert.SerializeObject(userStateNotValid);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var result = await client.PostAsync("User", content);
            Assert.False(result.IsSuccessStatusCode);
            mockUserService.Verify(userService => userService.Create(userStateNotValid as User, userStateNotValid.Password), Times.Never());
        }
    }
}
