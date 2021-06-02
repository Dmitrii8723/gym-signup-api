#!/bin/bash
CONTAINER=container
DB_NAME=postgres
NETWORK_NAME=postgres

echo "Stopping $CONTAINER container"
docker stop $CONTAINER &>/dev/null
echo "Creating $NETWORK_NAME container"
docker network create $NETWORK_NAME &>/dev/null

docker run -e 'TZ=Australia/Sydney' -d --rm -p 5432:5432 \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  --network $NETWORK_NAME --name $CONTAINER postgis/postgis:13-3.1-alpine
# Wait for connection
until docker run --rm -it --network $NETWORK_NAME postgis/postgis:13-3.1-alpine psql -h $CONTAINER -p 5432 -U postgres -w -c '\q' &>/dev/null
  do echo "Waiting for PSQL"
  sleep 1
done

echo Creating user
docker exec -u postgres $CONTAINER createuser -s --no-password admin
echo Creating DB