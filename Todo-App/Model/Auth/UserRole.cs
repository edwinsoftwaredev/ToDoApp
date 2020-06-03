using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Todo_App.DAL;

namespace Todo_App.Model.Auth
{
    public class UserRole : IdentityUserRole<string>, IEntity
    {
        User User { get; set; }
        Role Role { get; set; }
    }
}