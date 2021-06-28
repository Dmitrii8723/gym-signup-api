# gym-signup-api

Important: 
This project is utilising:
1. postresql image -> postgis/postgis:13-3.1-alpine
2. ApolloServer
3. Sequilize orm


<!-- Step by step guidance:  -->
1. execute `npm install`
2. execute `./db-reset.sh` (fyi, you need to have docker engine installed on your machine)
3. execute `npx sequelize-cli db:migrate --env development` in order to build users table
4. execute `npm test` in order to run all the avalible unit tests
5. use your own sendgrid api key (please navigate to sendgrid.js file in order to place it)
6. execute `npm start` to run the project

Request queries examples:
<!-- get users -->
query {
 users {  
    id
    email
    fname
    lname
}
}

<!-- create a user -->
mutation CreateUser($fname: String, $lname: String, $email: String, $password: String) {
  createUser(fname: $fname, lname: $lname, email: $email, password: $password) {
    fname,
    lname,
    email,
  }
}