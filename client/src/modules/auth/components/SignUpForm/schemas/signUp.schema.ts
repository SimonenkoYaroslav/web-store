import { object, ref, string } from "yup";

import en from "@localisation/en";

const { validation } = en.signUpForm;

export const signUpSchema = object({
    firstName: string().trim().required(validation.firstNameRequired),
    lastName: string().trim().required(validation.lastNameRequired),
    email: string().email(validation.emailInvalid).required(validation.emailRequired),
    password: string()
        .min(8, validation.passwordMin)
        .required(validation.passwordRequired),
    confirmPassword: string()
        .oneOf([ref("password")], validation.passwordsMatch)
        .required(validation.confirmPasswordRequired),
})
