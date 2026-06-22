import Link from 'next/link'

import en from '@localisation/en'

const t = en.forbiddenPage

export default function ForbiddenPage() {
    return (
        <div className="flex min-h-dvh w-full items-center justify-center px-4">
            <div className="glass-panel brutal-shadow-lg max-w-md p-10 text-center">
                <p className="font-serif text-7xl font-bold text-gold-600">{t.code}</p>
                <h1 className="mt-2 font-serif text-3xl font-bold text-brand-900">{t.title}</h1>
                <p className="mt-2 text-brand-600">
                    {t.description}
                </p>
                <Link
                    href="/catalog"
                    className="mt-6 inline-block border-2 border-brand-950 bg-brand-700 px-5 py-2.5 font-semibold uppercase tracking-wider text-white brutal-shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                >
                    {t.backLink}
                </Link>
            </div>
        </div>
    )
}
