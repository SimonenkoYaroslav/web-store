import { object, string } from "yup";



export const signInSchema = object({
    email: string().email('Invalid email format').required("Email is required"),
    password: string().required("Password is required"),
})