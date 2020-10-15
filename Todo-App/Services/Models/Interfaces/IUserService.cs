using System.Collections.Generic;
using System.Threading.Tasks;
using Todo_App.Model.Auth;

namespace Todo_App.Services.Models.Interfaces {
    public interface IUserService
    {
        //
        // Summary:
        //      Creates a User as a guest
        //
        // Parameters:
        //   user:
        //     The user to create.
        //
        // Returns:
        //     A void Task if the user model is valid, else throws an HttpResponseException
        //
        Task Create(User user);
        //
        // Summary:
        //      Creates a User with the role "User"
        //
        // Parameters:
        //   user:
        //     The user to create.
        //   password:
        //      The password to be hashed
        //
        // Returns:
        //     A void Task if the user model and password are valid, otherwise it
        //     throws an HttpResponseException
        //
        Task Create(User obj, string password);
        //
        // Summary:
        //      Creates a User with the given roles
        //
        // Parameters:
        //   user:
        //     The user to create.
        //   password:
        //      The password to be hashed
        //   roles:
        //      The list of roles to assign to the user
        //
        // Returns:
        //     A void Task if the user model, password and password are valid, otherwise it
        //     throws an HttpResponseException
        //
        Task Create(User user, string password, List<string> roles);
        Task Delete(string id);
        Task Update(User obj);
        Task<User> GetCurrentUser();
    }
}
