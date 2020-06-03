using IdentityServer4.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Todo_App.Services.Models
{
    /**
     * This class serves as a base class for models' services.
     * It need to have general methods for manage models, like create, delete, update, insert, ...
     */
    public abstract class BaseModelsService<T> where T : class
    {
        public BaseModelsService()
        {
        }
    }
}

