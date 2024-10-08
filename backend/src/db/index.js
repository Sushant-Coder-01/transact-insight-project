// Connect to the mongodb database.

import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstant = await mongoose.connect(`${process.env.MongoDB_URI}/${DB_NAME}`)
        console.log(`\nMongoDB Connected !! DB HOST : ${connectionInstant.connection.host}`)
        
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1);
    }
}

export default connectDB;