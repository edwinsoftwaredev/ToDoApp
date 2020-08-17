namespace Todo_App.Services.Models
{
    /**
     * This class serves as a base class for models' services.
     * It must have general methods to manage models, like create, delete, update, insert, ...
     */
    public abstract class BaseModelsService<T> where T : class
    {
        public BaseModelsService()
        {
        }
    }
}

