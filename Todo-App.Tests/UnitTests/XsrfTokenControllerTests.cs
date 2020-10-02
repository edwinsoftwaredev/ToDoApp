using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Todo_App.Controllers;
using Xunit;

namespace Todo_App.Tests.UnitTests
{
    public class XsrfTokenControllerTests
    {
        /*[Fact]
        public void GetToken_callGetToken_TokenReturned()
        {
            var mockAntiforgery = new Mock<IAntiforgery>();
            var mockLogger = Mock.Of<ILogger<XsrfTokenController>>();

            mockAntiforgery
                .Setup(expression => expression.GetAndStoreTokens(It.IsAny<HttpContext>()))
                .Returns(() => new AntiforgeryTokenSet("", "", "", ""));

            var xsrfTokenController = new XsrfTokenController(
                mockAntiforgery.Object,
                mockLogger
            );

            var result = xsrfTokenController.GetToken();

            Assert.IsType<NoContentResult>(result);
        }*/
    }
}
