// const express = require('express')  -> this is the old syntax of importing.
import express from "express" //importing express from the express node module
import dotenv from "dotenv" // importing all the .env variables.
import cors from "cors" // importing cors - Cross Origin Resources
import db from "./utils/db.js" // importing database file from Utils 


// import all routes
import userRoutes from './routes.user.routes.js'


dotenv.config()

const app = express();

app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.use(express.json());

app.use(express.urlencoded({extended:true}));

const port = process.env.port || 4000; 
// its a variable port - and we've added 3000
// common ports are - 3000 4000 5000 5173 8080 8000 etc
// there are around 65000 ports in computer science.

app.get('/', (req, res) => {
  res.send('Cohort!')
});

app.get("/ashutosh", (req, res) => { // route always start with a slash "/"
    res.send("Ashutosh!");
});

//connect to db
db();

//user routes
app.use("/api/v1/users", userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
