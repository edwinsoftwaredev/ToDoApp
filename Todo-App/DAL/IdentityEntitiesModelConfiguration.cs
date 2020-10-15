using Microsoft.EntityFrameworkCore;
using Todo_App.Model.Auth;
using Todo_App.Model.TodoRest;

namespace Todo_App.DAL
{
    public static class IdentityEntitiesModelConfiguration
    {
        // this method is just to rename the name of the tables and
        // define foreign keys to let the use of Navigation properties in some entities
        public static void EntitiesModelCustomConfiguration(ModelBuilder modelBuilder)
        {

            // configure Identity entities
            modelBuilder.Entity<User>(user =>
            {
                user.ToTable("User");
                user.HasMany(u => u.UserRoles)
                    .WithOne()
                    .HasForeignKey(ur => ur.UserId)
                    .IsRequired();
            });

            modelBuilder.Entity<Role>(role =>
            {
                role.ToTable("Role");
                role.HasMany(r => r.RoleUsers)
                    .WithOne()
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();
            });

            modelBuilder.Entity<RoleClaim>(rc =>
            {
                rc.ToTable("RoleClaim");
            });

            modelBuilder.Entity<UserClaim>(uc =>
            {
                uc.ToTable("UserClaim");
            });

            modelBuilder.Entity<UserLogin>(ul =>
            {
                ul.ToTable("UserLogin");
            });

            modelBuilder.Entity<UserRole>(ur =>
            {
                ur.ToTable("UserRole");
            });

            modelBuilder.Entity<UserToken>(ut =>
            {
                ut.ToTable("UserToken");
            });

            modelBuilder.Entity<TodoUser>(tu =>
            {

                tu.ToTable("TodoUser");
                tu.HasKey(tu => tu.UserId);
            });

            modelBuilder.Entity<Todo>(todo => {
                todo.ToTable("Todo");
                todo.HasKey(todo => todo.Id);
                todo.HasOne(todo => todo.CreatedBy)
                    .WithMany(todoUser => todoUser.Todos)
                    .HasForeignKey(props => props.CreatedById)
                    .IsRequired(true);
            });
        }
    }
}
