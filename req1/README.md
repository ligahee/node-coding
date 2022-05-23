# Req 1

- Create express.js app and use postgres sql as database.
- Make routes where user can register itself. Required fields of user are name, email and password.
- User can login with its email and password and gets a JWT token.
- Logged in users can create a post. Post has 3 attribues title, description and a photo.

## Authentication overview.

Login is handled by JWT authentication. Once a user logs in, they receive an access token in the body of the response, and a refresh token as an HTTP Only cookie. A refresh timer is triggered on login and will silenty refresh the access token as long as a valid refresh token is present (in the form of the HTTP Only cookie) when making the refresh_token call. The access token provides access to api endpoints protected by an authentication middleware.

## Installation
- Clone the repo
- Create a postgres database and run the db file 'create-db.sql' to create the tables in the database.
- add a .env file to the root directory with the following variables for the db you created:
  - DB_USER
  - DB_PW
  - DB_NAME
  - JWT_SECRET
  - REFRESH_SECRET
- Cd into the root directory and 'npm install'. 
- Run 'npm run dev' to start the local server at localhost:4000

## Technologies used
- Node.js
- TypeScript
- PostgreSQL
- Express
- JsonWebToken
- AWS S3
- AWS Elastic Beanstalk
