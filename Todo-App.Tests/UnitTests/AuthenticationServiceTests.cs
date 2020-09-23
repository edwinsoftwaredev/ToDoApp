using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;
using Todo_App.Services;
using Xunit;

namespace Todo_App.Tests.UnitTests {
    public class AuthenticationServiceTests {

        [Fact]
        public async void Authenticate_UserIsLoggedIn_ReturnFailed()
        {
            var mockLoggerSignInManager = Mock.Of<ILogger<SignInManager<User>>>();
            var mockHttpContextAccessor = Mock.Of<IHttpContextAccessor>();
            var mockUserStore = Mock.Of<IUserStore<User>>();
            var mockClaimsFactory = Mock.Of<IUserClaimsPrincipalFactory<User>>();
            var mockIOptions = Mock.Of<IOptions<IdentityOptions>>();
            var mockIUserConfirmation = Mock.Of<IUserConfirmation<User>>();
            var mockIAuthenticationSchemeProvider =
                Mock.Of<Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider>();
            var mockUserManager =
                new Mock<UserManager<User>>(mockUserStore, null, null, null, null, null, null, null, null);

            var mockSignInManager =
                new Mock<SignInManager<User>>(
                        mockUserManager.Object,
                        mockHttpContextAccessor,
                        mockClaimsFactory,
                        mockIOptions,
                        mockLoggerSignInManager,
                        mockIAuthenticationSchemeProvider,
                        mockIUserConfirmation
                    );

            var mockHttpContextAccessor1 = new Mock<IHttpContextAccessor>();

            var mockLogger = Mock.Of<ILogger<AuthenticationService>>();

            mockHttpContextAccessor1
                .Setup(hca => hca.HttpContext.User)
                .Returns(() => null);

            mockSignInManager
                .Setup(sim => sim.IsSignedIn(It.IsAny<ClaimsPrincipal>()))
                .Returns(true); // <-- USER IS ALREADY LOGGED IN

            mockSignInManager
                .Setup(sim => sim.PasswordSignInAsync(
                            It.IsAny<string>(),
                            It.IsAny<string>(),
                            It.IsAny<bool>(),
                            It.IsAny<bool>()
                            ))
                .Returns(() => null);

            var authenticationService =
                new AuthenticationService(mockSignInManager.Object,
                        mockLogger,
                        mockHttpContextAccessor1.Object
                        );

            var mockLoginData = new LoginData {
                Username = "IHAVEALREADYLOGGEDIN",
                         Password = "1Password!",
            };

            var result = await authenticationService.Authenticate(mockLoginData);

            Assert.IsType<SignInResult>(result);

            Assert.False(result.Succeeded);

            mockSignInManager
                .Verify(sim => sim.IsSignedIn(It.IsAny<ClaimsPrincipal>()), Times.Once);

            mockSignInManager
                .Verify(sim => sim.PasswordSignInAsync(
                            It.IsAny<string>(),
                            It.IsAny<string>(),
                            It.IsAny<bool>(),
                            It.IsAny<bool>()
                            ), Times.Never);

        }

        [Fact]
        public async void SignInResult_NotSucceded_ReturnFailed()
        {
            var mockLoggerSignInManager = Mock.Of<ILogger<SignInManager<User>>>();
            var mockHttpContextAccessor = Mock.Of<IHttpContextAccessor>();
            var mockUserStore = Mock.Of<IUserStore<User>>();
            var mockClaimsFactory = Mock.Of<IUserClaimsPrincipalFactory<User>>();
            var mockIOptions = Mock.Of<IOptions<IdentityOptions>>();
            var mockIUserConfirmation = Mock.Of<IUserConfirmation<User>>();
            var mockIAuthenticationSchemeProvider =
                Mock.Of<Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider>();
            var mockUserManager =
                new Mock<UserManager<User>>(mockUserStore, null, null, null, null, null, null, null, null);

            var mockSignInManager =
                new Mock<SignInManager<User>>(
                        mockUserManager.Object,
                        mockHttpContextAccessor,
                        mockClaimsFactory,
                        mockIOptions,
                        mockLoggerSignInManager,
                        mockIAuthenticationSchemeProvider,
                        mockIUserConfirmation
                    );

            var mockHttpContextAccessor1 = new Mock<IHttpContextAccessor>();

            var mockLogger = Mock.Of<ILogger<AuthenticationService>>();

            mockHttpContextAccessor1
                .Setup(hca => hca.HttpContext.User)
                .Returns(() => null);

            mockSignInManager
                .Setup(sim => sim.IsSignedIn(It.IsAny<ClaimsPrincipal>()))
                .Returns(false);

            mockSignInManager
                .Setup(sim => sim.PasswordSignInAsync(
                            It.IsAny<string>(),
                            It.IsAny<string>(),
                            It.IsAny<bool>(),
                            It.IsAny<bool>()
                            ))
                .Returns(Task.Run(() => SignInResult.Failed)); // <-- NOT SUCEEDED

            var authenticationService =
                new AuthenticationService(mockSignInManager.Object,
                        mockLogger,
                        mockHttpContextAccessor1.Object
                        );

            var mockLoginData = new LoginData {
                Username = "IHAVEALREADYLOGGEDIN",
                         Password = "1Password!",
            };

            var result = await authenticationService.Authenticate(mockLoginData);

            Assert.IsType<SignInResult>(result);

            Assert.False(result.Succeeded);

            mockSignInManager
                .Verify(sim => sim.IsSignedIn(It.IsAny<ClaimsPrincipal>()), Times.Once);

            mockSignInManager
                .Verify(sim => sim.PasswordSignInAsync(
                            It.IsAny<string>(),
                            It.IsAny<string>(),
                            It.IsAny<bool>(),
                            It.IsAny<bool>()
                            ), Times.Once);

        }

        [Fact]
        public async void SignInResult_Succeeded_ReturnsSucceded()
        {
            var mockLoggerSignInManager = Mock.Of<ILogger<SignInManager<User>>>();
            var mockHttpContextAccessor = Mock.Of<IHttpContextAccessor>();
            var mockUserStore = Mock.Of<IUserStore<User>>();
            var mockClaimsFactory = Mock.Of<IUserClaimsPrincipalFactory<User>>();
            var mockIOptions = Mock.Of<IOptions<IdentityOptions>>();
            var mockIUserConfirmation = Mock.Of<IUserConfirmation<User>>();
            var mockIAuthenticationSchemeProvider =
                Mock.Of<Microsoft.AspNetCore.Authentication.IAuthenticationSchemeProvider>();
            var mockUserManager =
                new Mock<UserManager<User>>(mockUserStore, null, null, null, null, null, null, null, null);

            var mockSignInManager =
                new Mock<SignInManager<User>>(
                        mockUserManager.Object,
                        mockHttpContextAccessor,
                        mockClaimsFactory,
                        mockIOptions,
                        mockLoggerSignInManager,
                        mockIAuthenticationSchemeProvider,
                        mockIUserConfirmation
                    );

            var mockHttpContextAccessor1 = new Mock<IHttpContextAccessor>();

            var mockLogger = Mock.Of<ILogger<AuthenticationService>>();

            mockHttpContextAccessor1
                .Setup(hca => hca.HttpContext.User)
                .Returns(() => null);

            mockSignInManager
                .Setup(sim => sim.IsSignedIn(It.IsAny<ClaimsPrincipal>()))
                .Returns(false);

            mockSignInManager
                .Setup(sim => sim.PasswordSignInAsync(
                            It.IsAny<string>(),
                            It.IsAny<string>(),
                            It.IsAny<bool>(),
                            It.IsAny<bool>()
                            ))
                .Returns(Task.Run(() => SignInResult.Success)); // <-- SUCEEDED

            var authenticationService =
                new AuthenticationService(mockSignInManager.Object,
                        mockLogger,
                        mockHttpContextAccessor1.Object
                        );

            var mockLoginData = new LoginData {
                Username = "IHAVEALREADYLOGGEDIN",
                         Password = "1Password!",
            };

            var result = await authenticationService.Authenticate(mockLoginData);

            Assert.IsType<SignInResult>(result);

            Assert.True(result.Succeeded);

            mockSignInManager
                .Verify(sim => sim.IsSignedIn(It.IsAny<ClaimsPrincipal>()), Times.Once);

            mockSignInManager
                .Verify(sim => sim.PasswordSignInAsync(
                            It.IsAny<string>(),
                            It.IsAny<string>(),
                            It.IsAny<bool>(),
                            It.IsAny<bool>()
                            ), Times.Once);
        }
    }
}
