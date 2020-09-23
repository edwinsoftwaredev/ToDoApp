using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;
using Todo_App.Services.Models.Interfaces;

namespace Todo_App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            this._userService = userService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateUser(UserVM userVM)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            await this._userService.Create(userVM as User, userVM.Password);

            return Ok();
        }
    }
}
