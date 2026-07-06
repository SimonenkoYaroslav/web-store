'use client'

import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AuthFormCard } from "@modules/auth/components/AuthFormCard";
import { authService } from "@modules/auth/services";
import { ISignUp } from "@modules/auth/types/auth.types";

import { createSignUpSchema } from "./schemas/signUp.schema";

type SignUpFormValues = ISignUp & { confirmPassword: string };

export const SignUpForm: FC = () => {
    const t = useTranslations('signUpForm');
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
    const signUpSchema = useMemo(() => createSignUpSchema(t), [t]);

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
            setServerError(error instanceof Error ? error.message : t('serverError'));
        }
    });

    return (
        <AuthFormCard
            onSubmit={onSubmit}
            brandLabel={t('brandLabel')}
            title={t('title')}
            subtitle={t('subtitle')}
            serverError={serverError}
            isSubmitting={isSubmitting}
            submitLabel={t('submitButton')}
            footerText={t('hasAccount')}
            footerLinkHref="/login"
            footerLinkLabel={t('signInLink')}
        >
            <TextField
                error={!!errors.firstName?.message}
                helperText={errors.firstName?.message}
                {...register('firstName')}
                autoComplete="off"
                required
                label={t('firstNameLabel')}
                fullWidth
            />

            <TextField
                error={!!errors.lastName?.message}
                helperText={errors.lastName?.message}
                {...register('lastName')}
                autoComplete="off"
                required
                label={t('lastNameLabel')}
                fullWidth
            />

            <TextField
                error={!!errors.email?.message}
                helperText={errors.email?.message}
                {...register('email')}
                autoComplete="off"
                required
                type="email"
                label={t('emailLabel')}
                fullWidth
            />

            <TextField
                error={!!errors.password?.message}
                helperText={errors.password?.message}
                {...register('password')}
                autoComplete="off"
                required
                type="password"
                label={t('passwordLabel')}
                fullWidth
            />

            <TextField
                error={!!errors.confirmPassword?.message}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword')}
                autoComplete="off"
                required
                type="password"
                label={t('confirmPasswordLabel')}
                fullWidth
            />
        </AuthFormCard>
    )
}

export default SignUpForm;
