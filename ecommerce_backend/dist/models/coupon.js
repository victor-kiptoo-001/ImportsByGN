import mongoose from "mongoose";
const schema = new mongoose.Schema({
    coupon: {
        type: String,
        required: [true, "please enter coupon"],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, "please enter Discount amount"],
    },
}, { timestamps: true });
export const Coupon = mongoose.model("Coupon", schema);
