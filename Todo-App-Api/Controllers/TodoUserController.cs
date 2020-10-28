using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Todo_App_Api.DAL;
using Todo_App_Api.Model.TodoRest;
using Todo_App_Api.Services.Models.Interfaces;

namespace Todo_App_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "TodoAppApiUser")]
    public class TodoUserController : ControllerBase
    {
        readonly ILogger<TodoUserController> _logger;
        readonly TodoDbContext _dbcontext;
        readonly ITodoUserService _userService;
        public TodoUserController(
            ILogger<TodoUserController> logger,
            TodoDbContext dbContext,
            ITodoUserService userService
        )
        {
            _logger = logger;
            _dbcontext = dbContext;
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<TodoUser>> GetTodoUser()
        {
            var user = await _userService.GetCurrentUser();

            if (user != null)
            {
                return user;
            }

            var todoUser = await _userService.CreateTodoUser();

            return  todoUser;
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTodoUser(string id)
        {
            var todoUser = await _userService.GetCurrentUser();

            if (todoUser == null)
            {
                return NotFound();
            }

            if (todoUser.UserId != id)
            {
                return BadRequest();
            }

            var result = _userService.DeleteUser(todoUser);

            if (!result.IsCompletedSuccessfully)
            {
                return BadRequest();
            }

            return Ok();
        }
    }
}
