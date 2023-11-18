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
    voucher?: Voucher,
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
    _id?: string,
    user: User,
    product: Product,
    score: number,
    note: string
    createdAt: Date,
    updatedAt: Date
}

export interface Voucher {
    _id?: string,
    code: string,
    discount: number,
    quantity: number,
    expired_date: Date,
    statusExpired?: string,
    status: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
}