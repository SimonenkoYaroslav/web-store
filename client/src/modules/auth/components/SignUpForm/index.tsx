'use client'

import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Box, Alert } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@components";
import { authService } from "@modules/auth/services";
import { ISignUp } from "@modules/auth/types/auth.types";

import { signUpSchema } from "./schemas/signUp.schema";

type SignUpFormValues = ISignUp & { confirmPassword: string };

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
            setServerError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        }
    });

    return (
        <div className="flex justify-center items-center h-screen">
            <Box
                component="form"
                onSubmit={onSubmit}
                className="flex p-7 flex-col gap-4 bg-white"
                noValidate
                autoComplete="off"
            >
                <h2 className="mb-4 text-black text-[32px] font-bold">Sign Up</h2>

                {serverError && <Alert severity="error">{serverError}</Alert>}

                <TextField
                    error={!!errors.firstName?.message}
                    helperText={errors.firstName?.message}
                    {...register('firstName')}
                    className="rounded-none"
                    autoComplete="off"
                    required
                    label="First name"
                />

                <TextField
                    error={!!errors.lastName?.message}
                    helperText={errors.lastName?.message}
                    {...register('lastName')}
                    className="rounded-none"
                    autoComplete="off"
                    required
                    label="Last name"
                />

                <TextField
                    error={!!errors.email?.message}
                    helperText={errors.email?.message}
                    {...register('email')}
                    className="rounded-none"
                    autoComplete="off"
                    required
                    type="email"
                    label="Email"
                />

                <TextField
                    error={!!errors.password?.message}
                    helperText={errors.password?.message}
                    {...register('password')}
                    className="rounded-none"
                    autoComplete="off"
                    required
                    type="password"
                    label="Password"
                />

                <TextField
                    error={!!errors.confirmPassword?.message}
                    helperText={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                    className="rounded-none"
                    autoComplete="off"
                    required
                    type="password"
                    label="Confirm password"
                />

                <Button type="submit" loading={isSubmitting} variant="contained">Sign up</Button>

                <p className="text-sm text-black">
                    Already have an account?{' '}
                    <Link className="text-blue-600 underline" href="/login">Sign in</Link>
                </p>
            </Box>
        </div>
    )
}

export default SignUpForm;
