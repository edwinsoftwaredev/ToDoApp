using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Todo_App_Api.DAL;
using Todo_App_Api.Services.Models;
using Todo_App_Api.Services.Models.Interfaces;

namespace Todo_App_Api
{
    public class Startup
    {

        private readonly string _dbConnectionString;
        private readonly string _corsPolicyTodoApi = "default";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            _dbConnectionString = Configuration.GetConnectionString("AzureSqlServerConnString");
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ReferenceLoopHandling =
                        Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });
            services.AddDbContext<TodoDbContext>();
            services.AddScoped<ITodoUserService, TodoUserService>();
            services.AddHttpContextAccessor();
            services.AddHttpClient();

            services.AddCors(options =>
            {
                options.AddPolicy(_corsPolicyTodoApi, policy =>
                {
                    policy.WithOrigins("https://todoapp-demo.azurewebsites.net")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = "https://todoapp-demo.azurewebsites.net";
                    options.Audience = "TodoAppApi";
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("TodoAppApiAdmin", builder =>
                {
                    builder.RequireAuthenticatedUser()
                        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                        .RequireClaim("scope", "TodoAppApi.TodoApp") // role must be added
                        .Build();
                });

                options.AddPolicy("TodoAppApiUser", builder =>
                {
                    builder.RequireAuthenticatedUser()
                        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                        .RequireClaim("scope", "TodoAppApi.TodoAppUser") // role must be added
                        .Build();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(_corsPolicyTodoApi);

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
