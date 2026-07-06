'use client'

import { yupResolver } from "@hookform/resolvers/yup";
import { TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { AuthFormCard } from "@modules/auth/components/AuthFormCard";
import { authService } from "@modules/auth/services";

import { createSignInSchema } from "./schemas/signIn.schema";

export const LogInForm: FC = () => {
    const t = useTranslations('logInForm');
    const [serverError, setServerError] = useState<string | null>(null);
    const signInSchema = useMemo(() => createSignInSchema(t), [t]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(signInSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
    })

    const onSubmit = handleSubmit(async (values) => {
        setServerError(null);

        try {
            await authService.signInUser(values);

            window.location.assign('/catalog')
        } catch (error) {
            setServerError(error instanceof Error ? error.message : t('serverError'));
        }
    })

    return (
        <AuthFormCard
            onSubmit={onSubmit}
            brandLabel={t('brandLabel')}
            title={t('title')}
            subtitle={t('subtitle')}
            serverError={serverError}
            isSubmitting={isSubmitting}
            submitLabel={t('submitButton')}
            footerText={t('noAccount')}
            footerLinkHref="/register"
            footerLinkLabel={t('signUpLink')}
        >
            <TextField
                error={!!errors.email?.message}
                {...register('email')}
                autoComplete="off"
                helperText={errors.email?.message}
                required
                id="outlined-required"
                label={t('emailLabel')}
                fullWidth
            />

            <TextField
                error={!!errors.password?.message}
                autoComplete="off"
                {...register('password')}
                id="outlined-password-input"
                label={t('passwordLabel')}
                type="password"
                helperText={errors.password?.message}
                fullWidth
            />
        </AuthFormCard>
    )
}

export default LogInForm;
