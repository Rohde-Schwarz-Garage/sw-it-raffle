using api.Auth;
using api.Data;
using api.Filters;
using api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddSingleton(typeof(JsonFile<WelcomePage>), _ => 
    new JsonFile<WelcomePage>(new WelcomePage(), builder.Environment.IsDevelopment() ? "./WelcomePage.json" : "/app/db/WelcomePage.json")
);
builder.Services.AddDbContext<DatabaseContext>(options => options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAuthentication("Bearer").AddScheme<AuthenticationSchemeOptions, PasswordAuthenticationHandler>("Bearer", null);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.WebHost.UseKestrel();
builder.WebHost.ConfigureKestrel((ctx, opt) => {
    opt.Configure(ctx.Configuration.GetSection("Kestrel"));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder => {
        builder.AllowAnyOrigin();
        builder.AllowAnyMethod();
        builder.AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

InitializeDatabase(app);

app.Run();
return;


static void InitializeDatabase(IHost app) {
    using var scope = app.Services.CreateScope();
    var services = scope.ServiceProvider;

    try {
        var configuration = services.GetRequiredService<IConfiguration>();
        var adminPassword = configuration["ADMIN_ACCESS_PASSWORD"];

        if (string.IsNullOrEmpty(adminPassword)) return;

        var context = services.GetRequiredService<DatabaseContext>();
        if (context.AccessPasswords.Any()) return;

        context.AccessPasswords.Add(new AccessPassword { Value=adminPassword, Role=RaffleRole.Admin });
        context.SaveChanges();
    } catch (Exception ex) {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the database.");
    }
}