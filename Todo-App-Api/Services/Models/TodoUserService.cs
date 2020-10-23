using System.Threading.Tasks;
using Todo_App_Api.Services.Models.Interfaces;
using Microsoft.AspNetCore.Http;
using Todo_App_Api.DAL;
using Todo_App_Api.Model.TodoRest;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Todo_App_Api.Services.Models
{
    public class TodoUserService : ITodoUserService
    {
        private readonly IHttpContextAccessor _httpContextAcessor;
        private readonly TodoDbContext _dbcontext;

        public TodoUserService
        (
                IHttpContextAccessor httpContextAccessor,
                TodoDbContext dbContext
        )
        {
            _httpContextAcessor = httpContextAccessor;
            _dbcontext = dbContext;
        }

        public Task<TodoUser> GetCurrentUser() {
            // this can be the nickname or id
            var idTodoUser = this._httpContextAcessor
                .HttpContext
                .User
                .FindFirst(ClaimTypes.NameIdentifier).Value; // this is sub or id in db

            var todoUserSet = this._dbcontext.Set<TodoUser>();

            return todoUserSet.SingleAsync(todoUser => todoUser.UserId == idTodoUser);
        }
    }
}
