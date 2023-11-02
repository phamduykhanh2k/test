import { Category } from "./category"

export interface Product {
    _id?: string,
    name: string,
    image: string,
    price: number,
    categories: Category,
    quantity: number,
    description: string
}