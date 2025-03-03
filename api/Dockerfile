FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release

WORKDIR /src
COPY ["api.csproj", "."]
RUN dotnet restore "./api.csproj"

COPY . .

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y dos2unix
RUN dos2unix entrypoint.sh

RUN dotnet tool install --global dotnet-ef
ENV PATH="$PATH:/root/.dotnet/tools"

RUN dotnet ef database update --connection "Data Source=AppData.db"

RUN dotnet build "./api.csproj" -c $BUILD_CONFIGURATION -o /app/build


FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/sdk:8.0 AS final
WORKDIR /run

COPY --from=publish /app/publish .
COPY --from=build ./src/AppData.db .

# RUN chown -R app:app ./
# RUN chmod -R 744 ./

COPY --from=build /src/entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 5001
# USER app

ENTRYPOINT ["/run/entrypoint.sh"]
