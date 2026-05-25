'use client'

import { TextField, Button, Box } from "@mui/material";

import styles from './styles.module.scss'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "./schemas/signIn.schema";
import { FC } from "react";
import { authService } from "@modules/auth/services";
import { redirect } from 'next/navigation'
import { UserRole } from "@modules/user/enums/UserRole";

export const LogInForm: FC = () => {
    const { register, formState: { errors }, getValues } = useForm({
        resolver: yupResolver(signInSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
    })

    const onSubmit = async () => {
        const values = getValues();
        const data = await authService.signInUser(values);
        if (data.user.user_metadata.role === UserRole.ADMIN) {
            redirect('/dashboard')
        }
        redirect('/catalog')
    }


    return (
        <div className={styles.content}>
            <Box
                component="form"
                className={styles.form}
                noValidate
                autoComplete="off"
            >
                <h2 className={styles.title}>Sign In</h2>
                <TextField
                    error={!!errors.email?.message}
                    {...register('email')}
                    className={styles.input}
                    autoComplete="off"
                    helperText={errors.email?.message}
                    required
                    name="email"
                    id="outlined-required"
                    label="Email"
                />

                <TextField
                    error={!!errors.password?.message}
                    className={styles.input}
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
