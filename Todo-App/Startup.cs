using System.Net.Mime;
using System.Reflection;
using IdentityServer4.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Todo_App.DAL;
using Todo_App.Model.Auth;
using Todo_App.Services.Models;
using Todo_App.Services.Models.Interfaces;

namespace Todo_App
{
    public class Startup
    {

        IConfiguration Configuration { get; }
        string ConnStringIdentityServer { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            ConnStringIdentityServer = GetConnectionStringIdentityServer();
        }

        private string GetConnectionStringIdentityServer()
        {
            return new SqlConnectionStringBuilder
            {
                DataSource = "localhost",
                IntegratedSecurity = true,
                UserID = Configuration["ConnData:UserID"],
                Password = Configuration["ConnData:Password"],
                InitialCatalog = Configuration["ConnData:Catalog"]
            }.ConnectionString;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(options => options.Filters.Add(new HttpResponseExceptionFilter()))
                .ConfigureApiBehaviorOptions(options =>
                {
                    options.InvalidModelStateResponseFactory = context =>  {
                        /*
                         * these lines change the results type to a serializable type (JSON)
                         **/
                        var result = new BadRequestObjectResult(context.ModelState);
                        result.ContentTypes.Add(MediaTypeNames.Application.Json);
                        return result;
                    };
                });

            services.AddDbContext<IdDbContext>();

            // *** adding other services *** //
            services.AddScoped<IUserService, UserService>();

            // *** ****** ***** ******** *** //

            services.AddIdentity<User, Role>(opts => {
                        opts.User.RequireUniqueEmail = true;
                    })
                .AddEntityFrameworkStores<IdDbContext>()
                .AddDefaultTokenProviders();

            var migrationAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            /*
             * OpenId Connect - OAuth 2.0 -->
             * Auth diagrams: https://christianlydemann.com/creating-an-openid-connect-system-with-angular-8-and-identityserver4-oidc-part-1/
             * Open Id Connect specification: https://openid.net/specs/openid-connect-core-1_0.html
             * pkce: https://tools.ietf.org/html/rfc7636
             *
             * For pkce                                       +-------------------+
                                                              |   Authz Server    |
                    +--------+                                | +---------------+ |
                    |        |--(A)- Authorization Request ---->|               | |
                    |        |       + t(code_verifier), t_m  | | Authorization | |
                    |        |                                | |    Endpoint   | |
                    |        |<-(B)---- Authorization Code -----|               | |
                    |        |                                | +---------------+ |
                    | Client |                                |                   |
                    |        |                                | +---------------+ |
                    |        |--(C)-- Access Token Request ---->|               | |
                    |        |          + code_verifier       | |    Token      | |
                    |        |                                | |   Endpoint    | |
                    |        |<-(D)------ Access Token ---------|               | |
                    +--------+                                | +---------------+ |
                                                              +-------------------+

                     Figure 2: Abstract Protocol Flow
             *
             * To understand better this; The authorization code has an utility of just one time in the token endpoint.
             * When an authorization request is sent, it is send with a sha256 encrypted random string
             * known as t(code_verifier) from a code_verifier. Auth server respond with an Authorization code as normal.
             * Then the client send the code to token endpoint along with the code_verifier without been transformed.
             * the code_verifier is used to compare and decript the t(code_verifier) sent in the first request.
             * If there is no match then the access token is not sent <-- the request is rejected.
             *
             * To know more about the attack read: https://tools.ietf.org/html/rfc7636#section-1
             */

            services.AddIdentityServer(options =>
                {
                    options.Events.RaiseErrorEvents = true;
                    options.Events.RaiseFailureEvents = true;
                    options.Events.RaiseInformationEvents = true;
                    options.Events.RaiseSuccessEvents = true;

                    options.UserInteraction = new UserInteractionOptions
                    {
                        LoginUrl = "http://localhost:3000/signin", // This must be the Server URL! -- Im testing now
                        LogoutUrl = "http://localhost:3000/signout", // This must be the Server URL! -- Im testing now
                        LoginReturnUrlParameter = "returnUrl"
                    };
                })
                .AddConfigurationStore(options =>
                {
                    options.ConfigureDbContext = builder =>
                    {
                        builder.UseSqlServer(ConnStringIdentityServer,
                            optionsBuilder => { optionsBuilder.MigrationsAssembly(migrationAssembly); });
                    };
                })
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = builder =>
                    {
                        builder.UseSqlServer(ConnStringIdentityServer,
                            optionsBuilder => { optionsBuilder.MigrationsAssembly(migrationAssembly); });
                    };
                    options.EnableTokenCleanup = true;
                })
                .AddDeveloperSigningCredential()
                .AddAspNetIdentity<User>();

            /*services.AddAuthentication()
                .AddIdentityServerAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme,
                    jwtOptions =>
                    {
                        jwtOptions.Authority = "https://localhost:5001";
                        jwtOptions.Audience = "TodoAppApi";
                    },
                    referenceOptions =>
                    {
                        // this is left empty for future configurations
                    });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("TodoAppApiAdminPolicy", builder =>
                {
                    builder.RequireScope("TodoAppApi.TodoApp");
                });

                options.AddPolicy("TodoAppApiUserPolicy", builder =>
                {
                    builder.RequireScope("TodoAppApi.TodoAppUser");
                });
            });*/

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else {
                app.UseExceptionHandler("/error");
                // app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            // https://identityserver4.readthedocs.io/en/latest/topics/startup.html
            // app.UseAuthentication(); <-- It's not needed when we add the IdentityServer middleware to the pipeline

            app.UseIdentityServer();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}
