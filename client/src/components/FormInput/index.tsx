'use client'

import { TextField } from "@mui/material";
import { FC } from "react";
import { Control, Controller } from "react-hook-form"

interface IFormInput {
    control: Control;
    type?: 'password' | 'text';
    name: string;
    label: string;
}

const FormInput: FC<IFormInput> = ({ control, name, label, type }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({
                field: { onChange, value },
                fieldState: { error },
            }) => (
                <TextField
                    helperText={error ? error.message : null}
                    size="small"
                    error={!!error}
                    onChange={onChange}
                    type={type}
                    value={value}
                    fullWidth
                    label={label}
                    variant="outlined"
                />
            )}
        />
    )
}

export default FormInput
