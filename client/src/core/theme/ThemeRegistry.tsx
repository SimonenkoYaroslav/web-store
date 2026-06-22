'use client'

import { ThemeProvider } from '@mui/material/styles';
import { FC, PropsWithChildren } from 'react';

import { theme } from './theme';

/**
 * Client-side MUI theme provider. Wraps the app inside the root layout (within
 * AppRouterCacheProvider) so every MUI component inherits the brown-gold theme.
 */
const ThemeRegistry: FC<PropsWithChildren> = ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default ThemeRegistry;
