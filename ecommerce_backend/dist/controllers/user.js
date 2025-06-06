import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { tryCatch } from "../middlewares/error.js";
export const newUser = tryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    let user = await User.findById(_id);
    if (user) {
        return res.status(200).json({
            status: "success",
            message: `Welcome back ${user.name}`,
        });
    }
    if (!_id || !name || !email || !photo || !gender || !dob)
        return next(new ErrorHandler("Please provide all the required fields", 400));
    user = await User.create({
        name,
        email,
        photo,
        gender,
        _id,
        dob: new Date(dob),
    });
    return res.status(201).json({
        status: "success",
        message: `Welcome, ${user.name}`,
    });
});
export const getAllUsers = tryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({
        status: "success",
        users,
    });
});
export const getUser = tryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("User not found", 404));
    return res.status(200).json({
        status: "success",
        user,
    });
});
export const deleteUser = tryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
        return next(new ErrorHandler("User not found", 404));
    if (user.role === "admin")
        return next(new ErrorHandler("Admin cannot be deleted", 400));
    await user.deleteOne();
    return res.status(200).json({
        status: "success",
        message: "User deleted successfully",
    });
});
