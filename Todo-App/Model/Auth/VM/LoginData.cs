using System.ComponentModel.DataAnnotations;

namespace Todo_App.Model.Auth.VM {
    /// <remarks>
    /// This interface is made for user logins
    /// </remarks>
    public class LoginData {
        public string Username {get; set;}
        [Required]
        [MinLength(6), MaxLength(60)]
        public string Password {get; set;}
    }
}
