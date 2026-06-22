const en = {
    logInForm: {
        brandLabel: 'Web_Store',
        title: 'Welcome back',
        subtitle: 'Sign in to continue to your account.',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        submitButton: 'Sign in',
        noAccount: "Don't have an account?",
        signUpLink: 'Sign up',
        serverError: 'Unable to sign in. Please try again.',
        validation: {
            emailInvalid: 'Invalid email format',
            emailRequired: 'Email is required',
            passwordRequired: 'Password is required',
        },
    },
    signUpForm: {
        brandLabel: 'Web_Store',
        title: 'Create account',
        subtitle: 'Join us in just a few steps.',
        firstNameLabel: 'First name',
        lastNameLabel: 'Last name',
        emailLabel: 'Email',
        passwordLabel: 'Password',
        confirmPasswordLabel: 'Confirm password',
        submitButton: 'Sign up',
        hasAccount: 'Already have an account?',
        signInLink: 'Sign in',
        serverError: 'Something went wrong. Please try again.',
        validation: {
            firstNameRequired: 'First name is required',
            lastNameRequired: 'Last name is required',
            emailInvalid: 'Invalid email format',
            emailRequired: 'Email is required',
            passwordMin: 'Password must be at least 8 characters',
            passwordRequired: 'Password is required',
            passwordsMatch: 'Passwords must match',
            confirmPasswordRequired: 'Please confirm your password',
        },
    },
} as const;

export default en;
