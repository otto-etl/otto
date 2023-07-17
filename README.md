### setting up the .env file in the server folder
The .env file in the server folder should contain the following environment variables: your local postgres username, password, workflow database name and port.
You don't need to change the database name or the port, just modify the PGUSER and PGPASSWORD to match you local db credentials

- PGUSER=postgres
- PGPASSWORD=password
- DBNAME=etl
- PORT=3001

### create databse and tables
run the create database and create table queries in the etl.sql file (in the root of the server folder) in your local postgres

### insert data
before running the INSERT query in the etl.sql file, modify the userName and password values in the load node to match your local database credentials

    "data": {
      "prev": "3",
      "label": "POSTGRES",
      "userName": "postgres",
      "password": "password",
      "port": "5432",
      "dbName": "dog",
      "sqlCode": "INSERT INTO dog(breed, count) VALUES(${breed}, ${num});",
      "output": ""
    },

Run the insert query

### setting up the .env file in the client root folder with the following variables
REACT_APP_PRODUCTION_URL=https://localhost:3001
REACT_APP_DEVELOPMENT_URL=http://localhost:3001
