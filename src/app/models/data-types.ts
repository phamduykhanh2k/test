import { Product } from "./product"

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