using System.ComponentModel.DataAnnotations;

namespace Todo_App.Model.Auth.VM {
    /// <remarks>
    /// This class is only used to create/register new users.
    /// Others actions use User class.
    /// </remarks>
    public class UserVM : User {
        // have to check if there is a spec for characters in passwords
        [Required]
        [MinLength(6), MaxLength(60)]
        public string Password { get; set; }
    }
}
