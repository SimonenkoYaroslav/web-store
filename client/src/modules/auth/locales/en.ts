import logInForm from '@auth/components/LogInForm/locales/en';
import signUpForm from '@auth/components/SignUpForm/locales/en';

const en = {
    ...logInForm,
    ...signUpForm,
} as const;

export default en;
