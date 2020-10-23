using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Todo_App_Api.DAL;
using Todo_App_Api.Model.TodoRest;
using Todo_App_Api.Model.TodoRest.VM;
using Todo_App_Api.Services.Models.Interfaces;

namespace Todo_App_Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "TodoAppApiUser")] // Add PolicyName
    public class TodoController : ControllerBase
    {
        private readonly ILogger<TodoController> _logger;
        private readonly TodoDbContext _dbcontext;
        private readonly ITodoUserService _todoUserService;
        public TodoController(
                ILogger<TodoController> logger,
                TodoDbContext dbContext,
                ITodoUserService todoUserService
        )
        {
            this._logger = logger;
            this._dbcontext = dbContext;
            this._todoUserService = todoUserService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Todo>>> getTodos()
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();
                var todoUser = await this._todoUserService.GetCurrentUser();

                var todos = await todoDbSet
                    .Where(todo => !todo.IsCompleted && todo.CreatedById == todoUser.UserId)
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
                var todoUser = await this._todoUserService.GetCurrentUser();

                var todos =  await todoDbSet
                    .Where(todo => todo.IsFeatured && todo.CreatedById == todoUser.UserId)
                    .ToListAsync();

                if (todos.Count == 0)
                {
                    return NoContent();
                }

                return todos;
            }
        }

        [HttpGet("completed")]
        public async Task<ActionResult<List<Todo>>> getCompletedTodos()
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();
                var todoUser = await this._todoUserService.GetCurrentUser();

                var todos =  await todoDbSet
                    .Where(todo => todo.IsCompleted && todo.CreatedById == todoUser.UserId)
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
                var todoUser = await this._todoUserService.GetCurrentUser();

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
            var todoUser = await this._todoUserService.GetCurrentUser();
            if (id != todo.Id && todo.CreatedById != todoUser.UserId)
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

                var todoUser = await this._todoUserService.GetCurrentUser();

                if (todo.CreatedById != todoUser.UserId) {
                    return BadRequest();
                }

                todoDbSet.Remove(todo);
                await this._dbcontext.SaveChangesAsync();
                return Accepted();
            }
        }
    }
}
