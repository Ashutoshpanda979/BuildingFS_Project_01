import mongoose from "mongoose";

const db = () => {
    mongoose
    .connect(process.env.MONGO_URL) // connceting mongodb - ref link saved in .env file as global variable.
    .then(()=>{
        console.log(`Connected to mongodb`);
    })
    .catch((err)=>{
        console.log(`Error connecting to mongodb`);
    })
}

export default db;