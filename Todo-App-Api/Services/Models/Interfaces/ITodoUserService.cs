using System.Threading.Tasks;
using Todo_App_Api.Model.TodoRest;

namespace Todo_App_Api.Services.Models.Interfaces {
    public interface ITodoUserService
    {
        Task<TodoUser> GetCurrentUser();
        Task<TodoUser> CreateTodoUser();
        Task DeleteUser(TodoUser user);
    }
}
