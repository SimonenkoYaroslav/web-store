'use client'

import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Box, Alert } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@components";
import en from "@localisation/en";
import { authService } from "@modules/auth/services";
import { ISignUp } from "@modules/auth/types/auth.types";

import { signUpSchema } from "./schemas/signUp.schema";

type SignUpFormValues = ISignUp & { confirmPassword: string };

const t = en.signUpForm;

export const SignUpForm: FC = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormValues>({
        resolver: yupResolver(signUpSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
    })

    const onSubmit = handleSubmit(async ({ email, password, firstName, lastName }) => {
        setServerError(null);

        try {
            const data = await authService.signUpUser({ email, password, firstName, lastName });

            // With email confirmation enabled signUp returns no session — send the
            // user to sign in once they have confirmed. Otherwise log them straight in.
            router.push(data.session ? '/catalog' : '/login');
        } catch (error) {
            setServerError(error instanceof Error ? error.message : t.serverError);
        }
    });

    return (
        <div className="flex justify-center items-center min-h-dvh px-4 py-10">
            <Box
                component="form"
                onSubmit={onSubmit}
                className="glass-panel brutal-shadow-lg flex w-full max-w-sm flex-col gap-4 p-8"
                noValidate
                autoComplete="off"
            >
                <div className="mb-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-700">{t.brandLabel}</p>
                    <h2 className="font-serif text-4xl font-bold text-brand-900">{t.title}</h2>
                    <p className="mt-1 text-sm text-brand-600">{t.subtitle}</p>
                </div>

                {serverError && <Alert severity="error">{serverError}</Alert>}

                <TextField
                    error={!!errors.firstName?.message}
                    helperText={errors.firstName?.message}
                    {...register('firstName')}
                    autoComplete="off"
                    required
                    label={t.firstNameLabel}
                    fullWidth
                />

                <TextField
                    error={!!errors.lastName?.message}
                    helperText={errors.lastName?.message}
                    {...register('lastName')}
                    autoComplete="off"
                    required
                    label={t.lastNameLabel}
                    fullWidth
                />

                <TextField
                    error={!!errors.email?.message}
                    helperText={errors.email?.message}
                    {...register('email')}
                    autoComplete="off"
                    required
                    type="email"
                    label={t.emailLabel}
                    fullWidth
                />

                <TextField
                    error={!!errors.password?.message}
                    helperText={errors.password?.message}
                    {...register('password')}
                    autoComplete="off"
                    required
                    type="password"
                    label={t.passwordLabel}
                    fullWidth
                />

                <TextField
                    error={!!errors.confirmPassword?.message}
                    helperText={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                    autoComplete="off"
                    required
                    type="password"
                    label={t.confirmPasswordLabel}
                    fullWidth
                />

                <Button type="submit" loading={isSubmitting} variant="contained" size="large">{t.submitButton}</Button>

                <p className="text-sm text-brand-600">
                    {t.hasAccount}{' '}
                    <Link className="font-semibold text-gold-700 underline-offset-2 hover:underline" href="/login">{t.signInLink}</Link>
                </p>
            </Box>
        </div>
    )
}

export default SignUpForm;
