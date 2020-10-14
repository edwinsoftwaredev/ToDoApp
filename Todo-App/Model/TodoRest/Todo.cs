using System;

namespace Todo_App.Model.TodoRest {
    public class Todo {
        public int Id { get; set; }
        public string CreateById { get; set; }
        public UserTodo CreateBy { get; set; }
        public string Title { get; set; }
        public string Description { get;  set; }
        public bool IsFetured { get; set; }
        public DateTime EndDate { get; set; }
        public bool Cheked { get; set; }
    }
}
