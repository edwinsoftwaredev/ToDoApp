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
        [Fact]
        public async Task CreateUser_StateNotValid_BadRequest()
        {
            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(userService => userService.Create(It.IsAny<User>(), It.IsAny<string>()))
                .Returns(Task.CompletedTask) // it must return a completed task
                .Verifiable();

            var userController = new UserController(mockUserService.Object);
            // When a ModelError is added to the ModelState, the actual state of the model(UserVM)
            // is not checked. So if the actual state is correct but it has been added a
            // ModelError to ModelState a BadRequest or Error is returned or thrown by the controller.
            userController.ModelState.AddModelError("Password", "Required");

            var userStateNotValid = new UserVM {};
            var result = await userController.CreateUser(userStateNotValid);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task CreateUser_StateValid_Ok()
        {
            var mockUserService = Mock.Of<IUserService>();
            Mock.Get(mockUserService)
                .Setup(service => service.Create(It.IsAny<User>(), It.IsAny<string>()))
                .Returns(Task.CompletedTask)
                .Verifiable();

            var userController = new UserController(mockUserService);
            // !!!!!MODELSTATE IS NOT VALIDATED!!!!!!
            // Integration tests validate the state
            var mockUser = new UserVM {};
            var result = await userController.CreateUser(mockUser);
            Assert.IsType<OkResult>(result);
        }
    }
}
