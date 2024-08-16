import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    dateofSale: Date,
    sole: Boolean,
});

export const Transaction = mongoose.model('Transaction', transactionSchema);