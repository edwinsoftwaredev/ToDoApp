using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Todo_App.DAL;

namespace Todo_App.Model.Auth
{
    public class User : IdentityUser, IEntity
    {
        public string Name { get; set; }
        public string Picture { get; set; }
        public List<UserRole> UserRoles { get; set; }
    }
}
