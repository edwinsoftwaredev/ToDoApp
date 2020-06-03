using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Todo_App.DAL;

namespace Todo_App.Model.Auth
{
    public class Role : IdentityRole, IEntity
    {
        public List<UserRole> RoleUsers { get; set; }
    }
}