using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Todo_App.DAL;
using Todo_App.Model.TodoRest;
using Todo_App.Model.TodoRest.VM;
using Todo_App.Services.Models.Interfaces;

namespace Todo_App.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [ValidateAntiForgeryToken]
    public class TodoController : ControllerBase
    {
        private readonly ILogger<TodoController> _logger;
        private readonly IdDbContext _dbcontext;
        private readonly IUserService _userService;
        public TodoController(
                ILogger<TodoController> logger,
                IdDbContext dbContext,
                IUserService userService
        )
        {
            this._logger = logger;
            this._dbcontext = dbContext;
            this._userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Todo>>> getTodos()
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();
                var user = await this._userService.GetCurrentUser();

                var todos = await todoDbSet
                    .Where(todo => !todo.IsCompleted && todo.CreatedById == user.Id)
                    .ToListAsync();

                if (todos.Count == 0)
                {
                    return NoContent();
                }

                return todos;
            }
        }

        [HttpGet("featured")]
        public async Task<ActionResult<List<Todo>>> getFeaturedTodos()
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();
                var user = await this._userService.GetCurrentUser();

                var todos =  await todoDbSet
                    .Where(todo => todo.IsFeatured && todo.CreatedById == user.Id)
                    .ToListAsync();

                if (todos.Count == 0)
                {
                    return NoContent();
                }

                return todos;
            }
        }

        [HttpGet("complete")]
        public async Task<ActionResult<List<Todo>>> getCompletedTodos()
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();
                var user = await this._userService.GetCurrentUser();

                var todos =  await todoDbSet
                    .Where(todo => todo.IsCompleted && todo.CreatedById == user.Id)
                    .ToListAsync();

                if (todos.Count == 0)
                {
                    return NoContent();
                }

                return todos;
            }
        }

        [HttpPost]
        public async Task<ActionResult<Todo>> saveTodo(TodoVM todoVM)
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();
                var user = await this._userService.GetCurrentUser();
                var todoUser = this._dbcontext.Set<TodoUser>()
                    .Single(todoUser => todoUser.UserId == user.Id);

                if (todoUser == null) {
                    return BadRequest();
                }

                var todo = new Todo {
                    Title = todoVM.Title,
                    CreatedById = todoUser.UserId,
                    Description = todoVM.Description,
                    IsCompleted = todoVM.IsCompleted,
                    IsFeatured = todoVM.IsFeatured,
                    EndDate = todoVM.EndDate
                };

                var result = await todoDbSet.AddAsync(todo);

                await this._dbcontext.SaveChangesAsync();

                return result.Entity;
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> updateTodo(int id, Todo todo)
        {
            var user = await this._userService.GetCurrentUser();
            if (id != todo.Id && todo.CreatedById != user.Id)
            {
                return BadRequest();
            }

            using (this._dbcontext)
            {
                this._dbcontext.Entry(todo).State = EntityState.Modified;

                await this._dbcontext.SaveChangesAsync();

                return Ok();
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> deleteTodo(int id)
        {
            using (this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();
                var todo = await todoDbSet.FindAsync(id);

                if (todo == null)
                {
                    return NotFound();
                }

                var user = await this._userService.GetCurrentUser();

                if (todo.CreatedById != user.Id) {
                    return BadRequest();
                }

                todoDbSet.Remove(todo);
                await this._dbcontext.SaveChangesAsync();
                return Accepted();
            }
        }
    }
}
