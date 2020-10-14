using System.Collections.Generic;
using Todo_App.Model.Auth;

namespace Todo_App.Model.TodoRest {
    public class UserTodo : User {
        public List<Todo> TodoList { get; set; }
    }
}
