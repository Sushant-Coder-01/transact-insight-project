import express from 'express';
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}))

// import routes

import transactionRouter from '../src/routes/transaction.routes.js'

// route declaration

app.use("/api/transactions",transactionRouter)

export default app ;