using System.Threading.Tasks;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
                Password = "1Password!",
                returnUrl = "NOTVALID"
            };

            var mockLogger = Mock.Of<ILogger<AuthenticationController>>();
            var mockIdentityServerInteractionService =
                Mock.Of<IIdentityServerInteractionService>();
            var mockAuthenticationService = new Mock<IAuthenticationService>();

            mockAuthenticationService
                .Setup(aus => aus.Authenticate(It.IsAny<LoginData>()))
                .Returns(Task.Run(() => Microsoft.AspNetCore.Identity.SignInResult.Failed));

            var authenticationController =
                new AuthenticationController(
                        mockAuthenticationService.Object,
                        mockLogger,
                        mockIdentityServerInteractionService);

            var result = await authenticationController.SignIn(mockLoginData);
            Assert.IsType<NotFoundResult>(result);
            mockAuthenticationService
                .Verify(aus => aus.Authenticate(It.IsAny<LoginData>()), Times.Once);
        }

        [Fact]
        public async void Authenticate_SignInSucceeded_ReturnSignInResultSucceeded()
        {
            var mockLoginData = new LoginData {
                Username = "THISUSERSUCCEED",
                Password = "1Password!",
                returnUrl = "https://localhost:5001/?client_id=1234"
            };

            var mockLogger = Mock.Of<ILogger<AuthenticationController>>();
            var mockIdentityServerInteractionService =
                Mock.Of<IIdentityServerInteractionService>();
            var mockAuthenticationService = new Mock<IAuthenticationService>();

            mockAuthenticationService
                .Setup(aus => aus.Authenticate(It.IsAny<LoginData>()))
                .Returns(Task.Run(() => Microsoft.AspNetCore.Identity.SignInResult.Success));

            var authenticationController =
                new AuthenticationController(
                        mockAuthenticationService.Object,
                        mockLogger,
                        mockIdentityServerInteractionService);

            var result = await authenticationController.SignIn(mockLoginData);

            Assert.IsType<OkObjectResult>(result);
            mockAuthenticationService
                .Verify(aus => aus.Authenticate(It.IsAny<LoginData>()), Times.Once);
        }
    }
}
