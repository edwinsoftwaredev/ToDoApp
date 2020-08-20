using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Todo_App.Controllers.Auth;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Models.Interfaces;
using Xunit;

namespace Todo_App.Tests.UnitTests
{
    public class UserControllerTests
    {
        /*[Fact]
        public async Task UserPost_ThrowsError_StateNotValid()
        {
            var userStateNotValid = new UserVM {};

            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(userService => userService.Create(userStateNotValid as User, userStateNotValid.Password))
                .Returns(() => Task.Factory.StartNew(() => {}));

            var userController = new UserController(mockUserService.Object);
            var result = await userController.CreateUser(userStateNotValid);
            Assert.IsType<BadRequestResult>(result);
        }*/
    }
}
