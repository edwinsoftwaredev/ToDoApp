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
        public TodoController(
                ILogger<TodoController> logger,
                IdDbContext dbContext
        )
        {
            this._logger = logger;
            this._dbcontext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<List<Todo>>> getTodos()
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();

                return await todoDbSet
                    .Where(todo => !todo.Cheked)
                    .ToListAsync();
            }
        }

        [HttpGet("featured")]
        public async Task<ActionResult<List<Todo>>> getFeaturedTodos()
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();

                return await todoDbSet
                    .Where(todo => todo.IsFetured)
                    .ToListAsync();
            }
        }

        [HttpGet("complete")]
        public async Task<ActionResult<List<Todo>>> getCompletedTodos()
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();

                return await todoDbSet
                    .Where(todo => todo.Cheked)
                    .ToListAsync();
            }
        }

        [HttpPost]
        public async Task<ActionResult<Todo>> saveTodo(TodoVM todoVM)
        {
            using(this._dbcontext)
            {
                var todoDbSet = this._dbcontext.Set<Todo>();

                var todo = new Todo {
                    Title = todoVM.Title,
                    Description = todoVM.Description,
                    Cheked = todoVM.Cheked,
                    IsFetured = todoVM.IsFetured,
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
            if (id != todo.Id)
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

                todoDbSet.Remove(todo);
                await this._dbcontext.SaveChangesAsync();
                return Accepted();
            }
        }
    }
}
