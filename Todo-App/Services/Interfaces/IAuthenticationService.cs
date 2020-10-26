using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Todo_App.Model.Auth;
using Todo_App.Model.Auth.VM;

namespace Todo_App.Services.Interfaces {
    public interface IAuthenticationService {
        public Task<SignInResult> Authenticate(LoginData loginData);
        public Task<SignInResult> AuthenticateByUser(User user);
        public Task<string> SignOut(string logoutId);
    }
}
