using System.Threading.Tasks;
using Todo_App.Model.Auth;

namespace Todo_App.Services.Models.Interfaces {
    public interface IUserService
    {
        Task Create(User user);
        Task Create(User obj, string password);
        Task Delete(string id);
        Task Update(User obj);
        Task Get(string id);
    }
}
