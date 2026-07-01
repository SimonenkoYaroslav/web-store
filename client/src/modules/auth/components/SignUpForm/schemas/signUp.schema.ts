import type { Messages, _Translator } from "next-intl";
import { object, ref, string } from "yup";

type Translate = _Translator<Messages, 'signUpForm'>;

export const createSignUpSchema = (t: Translate) =>
    object({
        firstName: string().trim().required(t('validation.firstNameRequired')),
        lastName: string().trim().required(t('validation.lastNameRequired')),
        email: string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
        password: string()
            .min(8, t('validation.passwordMin'))
            .required(t('validation.passwordRequired')),
        confirmPassword: string()
            .oneOf([ref("password")], t('validation.passwordsMatch'))
            .required(t('validation.confirmPasswordRequired')),
    });
