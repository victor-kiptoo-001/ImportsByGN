import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name"],
    },
    photo: {
        type: [String],
        required: [true, "please enter photo"],
    },
    price: {
        type: Number,
        required: [true, "please enter price"],
    },
    stock: {
        type: Number,
        required: [true, "please enter stock"],
    },
    category: {
        type: String,
        required: [true, "please enter category "],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "please enter description"],
        trim: true,
    },
    sold: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });
export const Product = mongoose.model("Product", schema);
