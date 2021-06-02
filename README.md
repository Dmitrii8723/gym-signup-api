# gym-signup-api

Important: This project is utilising postresql image -> postgis/postgis:13-3.1-alpine
Also, I have decided to use restful apis with express api.

<!-- Step by step guidance:  -->
1. run `npm install`
2. run `./db-reset.sh` (fyi, you need to have docker engine installed on your machine)
3. run `psql admin -h 127.0.0.1 -d postgres -f createUsersTable.sql` in order to build users table
4. use your own sendgrid api key (please navigate to sendgrid.js file in order to place it)

fyi, unit tests development is still in the progress...