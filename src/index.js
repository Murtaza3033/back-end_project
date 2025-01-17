//require ('dotenv').config({path:'./env'})

import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path: "./.env"
})

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("Error",error);
        throw error
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at PORT:${process.env.PORT}`);
    })
})

.catch((err)=>{
    console.log("Error connecting to MONGO DB",err);
})










/*
import express from "express";

const app=express()
// function connectDb(){
// }
// connectDb

;(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("Error:",error);
        throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port${process.env.PORT}`)
       })
        
    } catch (error) {
        console.error("Error",error)
        throw err
    }
})()
    */