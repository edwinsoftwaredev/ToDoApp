using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Moq;
using Todo_App.Controllers;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Interfaces;
using Xunit;

namespace Todo_App.Tests.UnitTests
{
    public class AuthenticationControllerTests
    {
        [Fact]
        public async void Authenticate_SignInFailed_ReturnSignInResultFailed()
        {
            var mockLoginData = new LoginData {
                Username = "THISUSERFAILS",
                Password = "1Password!"
            };

            var mockAuthenticationService = new Mock<IAuthenticationService>();

            mockAuthenticationService
                .Setup(aus => aus.Authenticate(It.IsAny<LoginData>()))
                .Returns(Task.Run(() => SignInResult.Failed));

            var authenticationController =
                new AuthenticationController(mockAuthenticationService.Object);

            var result = await authenticationController.Authenticate(mockLoginData);

            Assert.False(result.Succeeded);
            mockAuthenticationService
                .Verify(aus => aus.Authenticate(It.IsAny<LoginData>()), Times.Once);
        }

        [Fact]
        public async void Authenticate_SignInSucceeded_ReturnSignInResultSucceeded()
        {
            var mockLoginData = new LoginData {
                Username = "THISUSERSUCCEED",
                Password = "1Password!"
            };

            var mockAuthenticationService = new Mock<IAuthenticationService>();

            mockAuthenticationService
                .Setup(aus => aus.Authenticate(It.IsAny<LoginData>()))
                .Returns(Task.Run(() => SignInResult.Success));

            var authenticationController =
                new AuthenticationController(mockAuthenticationService.Object);

            var result = await authenticationController.Authenticate(mockLoginData);

            Assert.True(result.Succeeded);
            mockAuthenticationService
                .Verify(aus => aus.Authenticate(It.IsAny<LoginData>()), Times.Once);
        }
    }
}
