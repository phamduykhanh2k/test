import { Product } from "./product"
import { User } from "./user"

export interface signUp {
    fullname: string,
    username: string,
    password: string
}

export interface CartItem {
    product: Product,
    quantity: number
}

export interface ToTalSumary {
    subTotal: number,
    shippingCost: number,
    discount?: number,
    total: number
}

export interface Order {
    _id?: string,
    userId: string,
    name: string,
    address: string,
    note: String,
    phone: string,
    shippingCost: number,
    totalPrice: number,
    paymentMethod: string,
    status: string,
    cart: CartItem[],
    createdAt?: Date,
    updatedAt?: Date
}

export interface Feedback {
    user: User,
    product: Product,
    score: number,
    note: string
}