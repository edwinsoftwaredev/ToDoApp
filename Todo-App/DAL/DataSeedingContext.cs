using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Todo_App.Model.Auth;
using Todo_App.Utils.Constants;

namespace Todo_App.DAL
{
    public static class DataSeedingContext
    {
        public static void Initialize(IdDbContext context,
                RoleManager<Role> roleManager)
        {
            // use code with caution
            context.Database.Migrate();

            if (context.Roles.Any())
            {
                return; // database has been seeded
            }

            // seeding database
            var result = roleManager.CreateAsync(new Role
                   {
                      Name = RoleConstants.USER_ROLE,
                      NormalizedName = RoleConstants.USER_ROLE
                   }).Result;

            if (!result.Succeeded)
                throw new Exception("An Error occurred when creating the DB");

            return;
        }
    }
}
