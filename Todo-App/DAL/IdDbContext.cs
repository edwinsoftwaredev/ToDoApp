using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Todo_App.Model.Auth;
using UserClaim = Todo_App.Model.Auth.UserClaim;

namespace Todo_App.DAL
{
    public class IdDbContext : IdentityDbContext<User,
        Role,
        string,
        UserClaim,
        UserRole,
        UserLogin,
        RoleClaim,
        UserToken>
    {
        IConfiguration Configuration { get; }

        public IdDbContext(DbContextOptions<IdDbContext> dbContextOptions,
            IConfiguration configuration) : base(dbContextOptions)
        {
            Configuration = configuration;
            // this.Database.Migrate();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // this goes first because previous implementations and their overrides

            // here we are doing a custom modeling of some entities i.e changing table names
            IdentityEntitiesModelConfiguration.EntitiesModelCustomConfiguration(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(
                    new SqlConnectionStringBuilder
                    {
                        DataSource = "localhost",
                        IntegratedSecurity = true,
                        UserID = Configuration["ConnData:UserID"],
                        Password = Configuration["ConnData:Password"],
                        InitialCatalog = Configuration["ConnData:Catalog"]
                    }.ConnectionString);
            }
        }
    }
}
