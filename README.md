# Somnio e-commerce

Backend: NestJS (TypeScript) + Mongoose  
Frontend: AngularJS 1.8
Database: MongoDB

## Prerequisites
- Node.js 18+
- MongoDB running locally (Configure URI in .env)

## Backend (api)
```
cd server
docker-compose up
```

Ducumentation in http://localhost:3000/docs

## Frontend (web)
```
cd client
npm install
npm start
```

open browser in http://localhost:8080


## Notes

Bulk ingeestion will no trow an error if sku is duplicated but perform an update

The create new product uses the create bulk. 
If an error is expected to show if the sku is already present two new endpoints should be created
 One for create that returns error on duplicate
 Another for update

Endpoints are not secured. A simple approach will be to create a login endpoint that returns a jwt token that is later returned by the front end and used to validate the user.

