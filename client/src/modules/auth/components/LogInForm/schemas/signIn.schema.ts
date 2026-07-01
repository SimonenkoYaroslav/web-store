import type { Messages, _Translator } from "next-intl";
import { object, string } from "yup";

type Translate = _Translator<Messages, 'logInForm'>;

export const createSignInSchema = (t: Translate) =>
    object({
        email: string().email(t('validation.emailInvalid')).required(t('validation.emailRequired')),
        password: string().required(t('validation.passwordRequired')),
    });
