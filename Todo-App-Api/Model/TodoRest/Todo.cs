using System;

namespace Todo_App_Api.Model.TodoRest {
    public class Todo {
        public int Id { get; set; }
        public string CreatedById { get; set; }
        public TodoUser CreatedBy { get; set; }
        public string Title { get; set; }
        public string Description { get;  set; }
        public bool IsFeatured { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsCompleted { get; set; }
    }
}
