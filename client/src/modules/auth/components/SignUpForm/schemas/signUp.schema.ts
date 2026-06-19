import { object, ref, string } from "yup";

export const signUpSchema = object({
    firstName: string().trim().required("First name is required"),
    lastName: string().trim().required("Last name is required"),
    email: string().email("Invalid email format").required("Email is required"),
    password: string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    confirmPassword: string()
        .oneOf([ref("password")], "Passwords must match")
        .required("Please confirm your password"),
})
