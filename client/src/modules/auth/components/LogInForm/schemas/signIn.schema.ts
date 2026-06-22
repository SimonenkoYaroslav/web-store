import { object, string } from "yup";

import en from "@localisation/en";

const { validation } = en.logInForm;

export const signInSchema = object({
    email: string().email(validation.emailInvalid).required(validation.emailRequired),
    password: string().required(validation.passwordRequired),
})
