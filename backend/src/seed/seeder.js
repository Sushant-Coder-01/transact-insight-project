import axios from 'axios';
import { Transaction } from '../models/Transaction.js';
import connectDB from '../db/index.js';

const seedData = async () => {
    try {
        await connectDB();
        const res = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.deleteMany({});
        await Transaction.insertMany(res.data);
        console.log('Database seeded!');
        process.exit(1);
    } catch (error) {
        console.log("Error while seeding database", error);
        process.exit(1);
    }
}

seedData(); 