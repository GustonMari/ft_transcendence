#!/bin/bash

until (pg_isready --dbname=ft_transcendence_database --host=postgres --port=5432) &> /dev/null; do
    echo "Waiting for postgres to start..."
    sleep 1
done

if [ "$MODE" = 'development' ]; then
    rm -f ./package.json 
    ln -s ./app/package.json ./package.json
    npm install
fi

echo "Generating Prisma Client..."
npx prisma generate --schema='./app/prisma/schema.prisma'

if [ "$MODE" = 'development' ]; then
    npx prisma migrate dev --name first-migration --schema='./app/prisma/schema.prisma' --preview-feature
    npx prisma db push --schema='./app/prisma/schema.prisma' --preview-feature
else
    npx prisma migrate deploy --schema='./app/prisma/schema.prisma' --preview-feature
    npx prisma db push --schema='./app/prisma/schema.prisma' --preview-feature
    npm run build
fi

IP_ADDRESS=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')
export IP_ADDRESS=$IP_ADDRESS

exec "$@"

