'use client'

import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Box, Alert } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@common/components";
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
        <div className="flex justify-center items-center min-h-dvh px-4 py-10">
            <Box
                component="form"
                onSubmit={onSubmit}
                className="glass-panel brutal-shadow-lg flex w-full max-w-sm flex-col gap-4 p-8"
                noValidate
                autoComplete="off"
            >
                <div className="mb-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-700">{t('brandLabel')}</p>
                    <h2 className="font-serif text-4xl font-bold text-brand-900">{t('title')}</h2>
                    <p className="mt-1 text-sm text-brand-600">{t('subtitle')}</p>
                </div>

                {serverError && <Alert severity="error">{serverError}</Alert>}

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

                <Button type="submit" loading={isSubmitting} variant="contained" size="large">{t('submitButton')}</Button>

                <p className="text-sm text-brand-600">
                    {t('noAccount')}{' '}
                    <Link className="font-semibold text-gold-700 underline-offset-2 hover:underline" href="/register">{t('signUpLink')}</Link>
                </p>
            </Box>
        </div>
    )
}

export default LogInForm;
