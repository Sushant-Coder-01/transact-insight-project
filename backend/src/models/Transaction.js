import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'clothings','other']
    },
    image: {
        type: String, // Cloudinary url
        required: true,
    },
    sold: {
        type: Boolean,
        required: true,
        default: false,
    },
    dateofSale: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export const Transaction = mongoose.model('Transaction', transactionSchema);