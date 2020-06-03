using System.Collections.Generic;
using System.Linq;
using IdentityServer4;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Entities;
using IdentityServer4.EntityFramework.Interfaces;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer4.Models;
using Client = IdentityServer4.Models.Client;

namespace Todo_App.DAL
{
    public class DataSeedingContext
    {
        public DataSeedingContext(ConfigurationDbContext configurationDbContext)
        {

        }
    }
}