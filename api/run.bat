@echo off
setlocal

dotnet tool list --global | findstr /C:"dotnet-ef" >nul
if %ERRORLEVEL% neq 0 (
    echo Installing dotnet ef
    dotnet tool install --global dotnet-ef
) else (
    echo dotnet ef is already installed
)

set ASPNETCORE_ENVIRONMENT=Development
set ADMIN_ACCESS_PASSWORD=IamNotASafePassword

dotnet restore
dotnet ef database update
dotnet run

endlocal