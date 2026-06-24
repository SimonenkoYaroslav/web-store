'use client'

import { CircularProgress } from '@mui/material';
import MuiButton, { ButtonProps } from '@mui/material/Button';
import { FC } from 'react';

interface IButtonProps extends ButtonProps {
    loading?: boolean;
}

/**
 * Shared button primitive wrapping MUI Button.
 *
 * Adds a `loading` flag that disables the button and renders a spinner in
 * place of the start icon — the pattern previously copy-pasted into every
 * modal's submit/confirm action.
 */
const Button: FC<IButtonProps> = ({ loading = false, disabled, startIcon, children, ...rest }) => (
    <MuiButton
        {...rest}
        disabled={disabled || loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
    >
        {children}
    </MuiButton>
);

export default Button;
