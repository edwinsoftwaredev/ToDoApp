using System;

namespace Todo_App_Api.Model.TodoRest.VM {
    public class TodoVM {
        public string Title { get; set; }
        public string Description { get;  set; }
        public bool IsFeatured { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsCompleted { get; set; }
    }
}
