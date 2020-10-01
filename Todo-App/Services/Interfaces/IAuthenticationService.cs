using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Todo_App.Model.Auth.VM;

namespace Todo_App.Services.Interfaces {
    public interface IAuthenticationService {
        public Task<SignInResult> Authenticate(LoginData loginData);
        public Task SignOut();
    }
}
