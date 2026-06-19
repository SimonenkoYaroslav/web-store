'use client'

import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Box, Alert } from "@mui/material";
import Link from "next/link";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@components";
import { authService } from "@modules/auth/services";
import { UserRole } from "@modules/user/enums/UserRole";

import { signInSchema } from "./schemas/signIn.schema";

export const LogInForm: FC = () => {
    const [serverError, setServerError] = useState<string | null>(null);

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
            setServerError(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
        }
    })

    return (
        <div className="flex justify-center items-center h-screen">
            <Box
                component="form"
                onSubmit={onSubmit}
                className="flex p-7 flex-col gap-4 bg-white"
                noValidate
                autoComplete="off"
            >
                <h2 className="mb-4 text-black text-[32px] font-bold">Sign In</h2>

                {serverError && <Alert severity="error">{serverError}</Alert>}

                <TextField
                    error={!!errors.email?.message}
                    {...register('email')}
                    className="rounded-none"
                    autoComplete="off"
                    helperText={errors.email?.message}
                    required
                    id="outlined-required"
                    label="Email"
                />

                <TextField
                    error={!!errors.password?.message}
                    className="rounded-none"
                    autoComplete="off"
                    {...register('password')}
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                />

                <Button type="submit" loading={isSubmitting} variant="contained">Sign in</Button>

                <p className="text-sm text-black">
                    Don&apos;t have an account?{' '}
                    <Link className="text-blue-600 underline" href="/register">Sign up</Link>
                </p>
            </Box></div >
    )
}

export default LogInForm;
