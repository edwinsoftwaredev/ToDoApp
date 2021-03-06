﻿using System.Threading.Tasks;
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

            return todoUserSet.SingleOrDefaultAsync(todoUser => todoUser.UserId == idTodoUser);
        }

        public Task<TodoUser> CreateTodoUser()
        {
            var user_UserId = this._httpContextAcessor
                .HttpContext
                .User
                .FindFirst(ClaimTypes.NameIdentifier).Value;

            var user_UserName = this._httpContextAcessor
                .HttpContext
                .User
                .FindFirst("preferred_username").Value;

            var todoUserSet = this._dbcontext.Set<TodoUser>();

            var todoUser = new TodoUser
            {
                UserId = user_UserId,
                UserName = user_UserName
            };

            var result = todoUserSet.Add(todoUser);

            var todoUserResult = this._dbcontext
                .SaveChangesAsync()
                .ContinueWith<TodoUser>((task) => result.Entity);

            return todoUserResult;
        }

        public async Task DeleteUser(TodoUser todoUser)
        {
            var todoUserSet = _dbcontext.Set<TodoUser>();
            todoUserSet.Remove(todoUser);
            await _dbcontext.SaveChangesAsync();
        }
    }
}
