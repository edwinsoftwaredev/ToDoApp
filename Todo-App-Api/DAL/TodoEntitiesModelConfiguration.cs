using Microsoft.EntityFrameworkCore;
using Todo_App_Api.Model.TodoRest;

namespace Todo_App_Api.DAL
{
    public static class TodoEntitiesModelConfiguration
    {
        // this method is just to rename the name of the tables and
        // define foreign keys to let the use of Navigation properties in some entities
        public static void EntitiesModelCustomConfiguration(ModelBuilder modelBuilder)
        {
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
