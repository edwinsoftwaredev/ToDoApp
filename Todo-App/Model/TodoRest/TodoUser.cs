using System.Collections.Generic;

namespace Todo_App.Model.TodoRest {
    public class TodoUser {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public List<Todo> Todos { get; set; }
    }
}
