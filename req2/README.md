# Requirements

- A post will have an attribute when it was created.
- Post returning api will calculate the time difference like 2s ago, 10d ago, 4w ago, 8m ago and 1yr ago.
- A post can have multiple photos but atmost 5.
- A post can be editied.

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
- create an s3 bucket on AWS and add the following variables to your .env file (for storing photos and saving the photo_urls in your database.)
  - AWS_REGION
  - AWS_BUCKETNAME
  - AWS_ACCESSIDKEY
  - AWS_SECRETACCESSKEY
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
