﻿using Microsoft.AspNetCore.Identity;
using Todo_App.DAL;

namespace Todo_App.Model.Auth
{
    public class RoleClaim : IdentityRoleClaim<string>, IEntity
    {
    }
}