using System.ComponentModel.DataAnnotations;

namespace Todo_App.Model.Auth.VM {
    /// <remarks>
    /// This interface is made for user logins
    /// </remarks>
    public class LoginData {
        [Required]
        public string Username { get; set; }
        [Required]
        [MinLength(6), MaxLength(60)]
        public string Password { get; set; }
        public string returnUrl { get; set; }
    }
}
