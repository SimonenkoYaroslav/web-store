'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@common/components'

interface IErrorProps {
    reset: () => void
}

export default function ErrorPage({ reset }: IErrorProps) {
    const t = useTranslations('errorPage')

    return (
        <div className="flex min-h-dvh w-full items-center justify-center px-4">
            <div className="glass-panel brutal-shadow-lg max-w-md p-10 text-center">
                <h1 className="font-serif text-3xl font-bold text-brand-900">{t('title')}</h1>
                <p className="mt-2 text-brand-600">
                    {t('description')}
                </p>
                <div className="mt-6">
                    <Button variant="contained" onClick={reset}>{t('retryButton')}</Button>
                </div>
            </div>
        </div>
    )
}
