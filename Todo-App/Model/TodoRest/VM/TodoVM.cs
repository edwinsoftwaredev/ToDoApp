using System;

namespace Todo_App.Model.TodoRest.VM {
    public class TodoVM {
        public string Title { get; set; }
        public string Description { get;  set; }
        public bool IsFetured { get; set; }
        public DateTime EndDate { get; set; }
        public bool Cheked { get; set; }
    }
}
