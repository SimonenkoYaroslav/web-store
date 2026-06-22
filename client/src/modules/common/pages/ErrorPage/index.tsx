'use client'

import { Button } from '@components'
import en from '@modules/common/locales/en'

interface IErrorProps {
    reset: () => void
}

const t = en.errorPage

export default function ErrorPage({ reset }: IErrorProps) {
    return (
        <div className="flex min-h-dvh w-full items-center justify-center px-4">
            <div className="glass-panel brutal-shadow-lg max-w-md p-10 text-center">
                <h1 className="font-serif text-3xl font-bold text-brand-900">{t.title}</h1>
                <p className="mt-2 text-brand-600">
                    {t.description}
                </p>
                <div className="mt-6">
                    <Button variant="contained" onClick={reset}>{t.retryButton}</Button>
                </div>
            </div>
        </div>
    )
}
