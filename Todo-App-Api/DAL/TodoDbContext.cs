using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Todo_App_Api.DAL
{
    public class TodoDbContext : DbContext
    {
        private readonly IConfiguration _configuration;
        public TodoDbContext(
                DbContextOptions<TodoDbContext> options,
                IConfiguration configuration
        ) : base(options)
        {
            this._configuration = configuration;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            TodoEntitiesModelConfiguration.EntitiesModelCustomConfiguration(modelBuilder);
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
                        UserID = _configuration["ConnData:UserID"],
                        Password = _configuration["ConnData:Password"],
                        InitialCatalog = _configuration["ConnData:Catalog"]
                    }.ConnectionString);
            }
        }
    }
}
