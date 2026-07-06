'use client'

import { Alert, Box } from "@mui/material";
import Link from "next/link";
import { FC, FormEventHandler, PropsWithChildren } from "react";

import { Button } from "@common/components";

interface IProps {
    onSubmit: FormEventHandler<HTMLFormElement>;
    brandLabel: string;
    title: string;
    subtitle: string;
    serverError: string | null;
    isSubmitting: boolean;
    submitLabel: string;
    footerText: string;
    footerLinkHref: string;
    footerLinkLabel: string;
}

/**
 * The glass-panel card shell shared by the login and sign-up forms: brand
 * header, server-error alert, submit button and the footer link to the
 * opposite form. The owning form supplies its fields as children.
 */
export const AuthFormCard: FC<PropsWithChildren<IProps>> = ({
    onSubmit,
    brandLabel,
    title,
    subtitle,
    serverError,
    isSubmitting,
    submitLabel,
    footerText,
    footerLinkHref,
    footerLinkLabel,
    children,
}) => (
    <div className="flex justify-center items-center min-h-dvh px-4 py-10">
        <Box
            component="form"
            onSubmit={onSubmit}
            className="glass-panel brutal-shadow-lg flex w-full max-w-sm flex-col gap-4 p-8"
            noValidate
            autoComplete="off"
        >
            <div className="mb-2">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-700">{brandLabel}</p>
                <h2 className="font-serif text-4xl font-bold text-brand-900">{title}</h2>
                <p className="mt-1 text-sm text-brand-600">{subtitle}</p>
            </div>

            {serverError && <Alert severity="error">{serverError}</Alert>}

            {children}

            <Button type="submit" loading={isSubmitting} variant="contained" size="large">{submitLabel}</Button>

            <p className="text-sm text-brand-600">
                {footerText}{' '}
                <Link
                    className="font-semibold text-gold-700 underline-offset-2 hover:underline"
                    href={footerLinkHref}
                >
                    {footerLinkLabel}
                </Link>
            </p>
        </Box>
    </div>
);
