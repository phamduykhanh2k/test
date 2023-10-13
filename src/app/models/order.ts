import { Cart } from "./cart";
import { Product } from "./product";

export interface Order {
    _id?: string,
    userId: string,
    address: String,
    note?: String,
    phoneNumber: String,
    shippingCost: Number,
    totalPrice: Number,
    status: String,
    products?: Product[]
    createdAt?: Date,
    updatedAt?: Date
}