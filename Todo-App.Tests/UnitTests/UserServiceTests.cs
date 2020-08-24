using System.Threading.Tasks;
using IdentityServer4.Services;
using Microsoft.AspNetCore.Identity;
using Moq;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Models;
using Xunit;

namespace Todo_App.Tests.UnitTests
{
    public class UserServiceTests
    {
        [Fact]
        public async void CreateUser_UserAndPasswordNotValid_HasThrownException()
        {
            // mocking IdentityResult to get a not succeeded return value
            /*var mockIdentityResult = Mock.Of<IdentityResult>();
            Mock.Get(mockIdentityResult)
                .Setup(ir => ir.Succeeded)
                .Returns(false);*/

            var mockUserStore = Mock.Of<IUserStore<User>>();

            var mockUserManager =
                new Mock<UserManager<User>>(mockUserStore, null, null, null, null, null, null, null, null);

            mockUserManager
                .Setup(ums => ums.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .Returns(Task.Run(() => IdentityResult.Failed()));

            // For future references
            // mockUserManager.Object.UserValidators.Add(new UserValidator<TUser);
            // mockUserManager.Object.PasswordValidators.Add(new PasswordValidator<TUser>());

            // does nothing atm
            var mockIIdentityServerInteractionService =
                Mock.Of<IIdentityServerInteractionService>();

            // Injecting mocks
            var userService =
                new UserService(mockUserManager.Object, mockIIdentityServerInteractionService);

            var mockUserVM = new UserVM {};

            await Assert.ThrowsAsync<HttpResponseException>(() => userService.Create(mockUserVM as User, mockUserVM.Password));
            mockUserManager
                .Verify(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()), Times.Once());
        }

        [Fact]
        public void CreateUser_UserAndPasswordValid_Void()
        {
            var mockUserStore = Mock.Of<IUserStore<User>>();

            var mockUserManager =
                new Mock<UserManager<User>>(mockUserStore, null, null, null, null, null, null, null, null);

            mockUserManager
                .Setup(ums => ums.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .Returns(Task.Run(() => IdentityResult.Success));

            var mockIIdentityServerInteractionService =
                Mock.Of<IIdentityServerInteractionService>();

            var userService =
                new UserService(mockUserManager.Object, mockIIdentityServerInteractionService);

            var mockUserVM = new UserVM {};

            var result = userService.Create(mockUserVM as User, mockUserVM.Password);
            // IsFaulted returns true if the task has thrown an unhandled exception
            //
            // ThrowsAsync throws an exception which means that the task isFaulted when the
            // function(var result) has not thrown a HttpResponseException
            Assert.True((Assert.ThrowsAsync<HttpResponseException>(() => result).IsFaulted));
            mockUserManager
                .Verify(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()), Times.Once());
        }
    }
}
