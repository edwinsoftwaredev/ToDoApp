using System.Threading.Tasks;

namespace Todo_App.Services.Models.Interfaces
{
    ///<summary>
    ///Interface designed to be implemented by all services that work with models.
    ///<remarks>further implementations must have their own interface</remarks>
    ///</summary>
    public interface IService<T, U> where T: class
        where U: struct
    {
        Task Create(T obj);
        Task Delete(U id);
        Task Update(T obj);
        Task Get(U id);
    }
}

