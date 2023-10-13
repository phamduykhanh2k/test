export interface User {
    _id?: string,
    fullname: string,
    username: string,
    password: string,
    role: string,
    email?: string,
    phone?: string,
    address?: string,
    gender?: number,
}