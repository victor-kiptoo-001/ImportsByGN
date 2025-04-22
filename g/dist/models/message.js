import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name"],
    },
    email: {
        type: String,
        required: [true, "please enter email"],
    },
    phone: {
        type: String,
        required: [true, "please enter phone"],
    },
    message: {
        type: String,
        required: [true, "please enter message"],
    },
}, { timestamps: true });
export const Message = mongoose.model("Messages", schema);
