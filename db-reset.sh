#!/bin/bash
CONTAINER=container
NETWORK=postgres

docker stop $CONTAINER &>/dev/null
docker network create $NETWORK &>/dev/null

docker run -e 'TZ=Australia/Sydney' -d --rm -p 5432:5432 \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  --network $NETWORK --name $CONTAINER postgis/postgis:13-3.1-alpine
until docker run --rm -it --network $NETWORK postgis/postgis:13-3.1-alpine psql -h $CONTAINER -p 5432 -U postgres -w -c '\q' &>/dev/null
  do echo "Wait for PSQL"
  sleep 1
done
docker exec -u postgres $CONTAINER createuser -s --no-password admin
echo Creating DB