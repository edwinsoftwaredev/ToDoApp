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
        private readonly ILogger<TodoUserController> _logger;
        private readonly TodoDbContext _dbcontext;
        private readonly ITodoUserService _userService;
        public TodoUserController(
            ILogger<TodoUserController> logger,
            TodoDbContext dbContext,
            ITodoUserService userService
        )
        {
            this._logger = logger;
            this._dbcontext = dbContext;
            this._userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<TodoUser>> getTodoUser()
        {
            var user = await this._userService.GetCurrentUser();

            if (user != null)
            {
                return user;
            } else
            {
                var todoUser = await this._userService.CreateTodoUser();

                return  todoUser;
            }

        }

    }
}
