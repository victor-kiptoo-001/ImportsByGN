import mongoose from "mongoose";
import { myCache } from "../app.js";
import { Product } from "../models/product.js";
import ErrorHandler from "./utility-class.js";
export const connectDB = async (uri) => {
    mongoose
        .connect(uri, {
        dbName: "ecommerce",
    })
        .then((c) => console.log(`connected to ${c.connection.host}`))
        .catch((err) => console.log(err));
};
export const invalidateCache = ({ product, admin, order, userId, orderId, productId, messages, }) => {
    if (product) {
        const productKeys = [
            "latest-product",
            "categories",
            "all-products",
        ];
        if (typeof productId === "string") {
            productKeys.push(`product-${productId}`);
        }
        if (typeof productId === "object") {
            productKeys.forEach((i) => productKeys.push(`product-${i}`));
        }
        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];
        myCache.del(orderKeys);
    }
    if (admin) {
        const adminKeys = [
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts",
        ];
        myCache.del(adminKeys);
    }
    if (messages) {
        myCache.del("messages");
    }
};
export const reduceStock = async (orderItems) => {
    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product)
            throw new ErrorHandler("product not found", 404);
        if (product.stock == 0)
            product.stock = 0;
        product.stock -= order.quantity;
        product.sold = (product.sold || 0) + order.quantity;
        await product.save();
    }
};
export const calculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return Number((thisMonth * 100).toFixed(0));
    const percent = (thisMonth / lastMonth) * 100;
    return Number(percent.toFixed(0));
};
export const getInventories = async ({ categories, productCount, }) => {
    const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
    const categoriesCount = await Promise.all(categoriesCountPromise);
    const categoryCount = [];
    categories.forEach((category, index) => {
        categoryCount.push({
            [category]: Math.round((categoriesCount[index] / productCount) * 100),
        });
    });
    return categoryCount;
};
export const getChartData = ({ length, docArr, today, property, }) => {
    const data = new Array(length).fill(0);
    docArr.forEach((i) => {
        const creationDate = i.createdAt;
        const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < length) {
            if (monthDiff < length) {
                if (property) {
                    data[length - monthDiff - 1] += i[property] || 0;
                }
                else {
                    data[length - monthDiff - 1] += 1;
                }
            }
        }
    });
    return data;
};
