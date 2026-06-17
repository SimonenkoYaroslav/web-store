'use client'

import { TextField, Box } from "@mui/material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "./schemas/signIn.schema";
import { FC } from "react";
import { Button } from "@components";
import { authService } from "@modules/auth/services";
import { useRouter } from 'next/navigation'
import { UserRole } from "@modules/user/enums/UserRole";

export const LogInForm: FC = () => {
    const router = useRouter()
    const { register, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(signInSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
    })

    const onSubmit = async () => {
        const values = getValues();
        const data = await authService.signInUser(values);
        
        if (data.user.user_metadata.role === UserRole.ADMIN) {
            router.push('/dashboard')
            return;
        }

        router.push('/catalog')
    }


    return (
        <div className="flex justify-center items-center h-screen">
            <Box
                component="form"
                className="flex p-7 flex-col gap-4 bg-white"
                noValidate
                autoComplete="off"
            >
                <h2 className="mb-4 text-black text-[32px] font-bold">Sign In</h2>
                <TextField
                    error={!!errors.email?.message}
                    {...register('email')}
                    className="rounded-none"
                    autoComplete="off"
                    helperText={errors.email?.message}
                    required
                    name="email"
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
                    name="password"
                    type="password"
                />

                <Button onClick={onSubmit} variant="contained">Sign in</Button>
            </Box></div >
    )
}

export default LogInForm;
