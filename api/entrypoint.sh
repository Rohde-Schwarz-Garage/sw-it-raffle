#! /bin/sh

mkdir -p /app/db
chown -R app:app /app/db
chmod -R 755 /app/db

if [ ! -f /app/db/AppData.db ]; then
    mkdir -p /app/db
    mv ./AppData.db /app/db/AppData.db
fi

su - app
exec dotnet api.dll