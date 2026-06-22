import DiamondOutlined from '@mui/icons-material/DiamondOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined';
import type { Metadata } from 'next';
import Link from 'next/link';

import { SignOutButton } from '@modules/auth/components';
import { userService } from '@modules/user/services';

import en from './locales/en';

const t = en.homePage;

export const metadata: Metadata = {
    title: t.metadata.title,
    description: t.metadata.description,
};

const VALUE_ICONS = [DiamondOutlined, LockOutlined, LocalShippingOutlined, SupportAgentOutlined];

const PRIMARY_CTA =
    'inline-flex items-center justify-center gap-2 border-2 border-brand-950 bg-brand-700 px-6 py-3 font-semibold uppercase tracking-wider text-white brutal-shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0';

const SECONDARY_CTA =
    'inline-flex items-center justify-center gap-2 border-2 border-brand-950 bg-sand-50 px-6 py-3 font-semibold uppercase tracking-wider text-brand-900 brutal-shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0';

const HEADER_GHOST_LINK =
    'border-2 border-transparent px-4 py-2 text-sm font-semibold uppercase tracking-wider text-brand-900 transition-colors hover:border-brand-950 hover:bg-brand-50';

const HEADER_SOLID_LINK =
    'border-2 border-brand-950 bg-gold-400 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-brand-950 brutal-shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5';

const CTA_SOLID =
    'inline-flex items-center justify-center border-2 border-brand-950 bg-gold-400 px-7 py-3 font-semibold uppercase tracking-wider text-brand-950 brutal-shadow-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5';

const CTA_OUTLINE =
    'inline-flex items-center justify-center border-2 border-gold-200 px-7 py-3 font-semibold uppercase tracking-wider text-gold-50 transition-colors hover:bg-white/10';

export default async function HomePage() {
    const user = await userService.fetchCurrentUser();

    return (
        <div className="min-h-dvh">
            {/* Header */}
            <header className="sticky top-0 z-20">
                <div className="glass-panel mx-auto mt-4 flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
                    <Link
                        href="/"
                        className="font-serif text-xl font-bold uppercase tracking-[0.2em] text-brand-900"
                    >
                        {t.header.brandName}
                    </Link>
                    <nav className="flex items-center gap-2 sm:gap-3">
                        {user ? (
                            <>
                                <Link href="/catalog" className={HEADER_SOLID_LINK}>
                                    {t.header.enterStore}
                                </Link>
                                <SignOutButton className={HEADER_GHOST_LINK}>{t.header.signOut}</SignOutButton>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className={HEADER_GHOST_LINK}>
                                    {t.header.signIn}
                                </Link>
                                <Link href="/register" className={HEADER_SOLID_LINK}>
                                    {t.header.createAccount}
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero */}
            <section className="mx-auto max-w-6xl px-5 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
                    {t.hero.tagline}
                </p>
                <h1 className="mx-auto mt-4 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-brand-900 sm:text-6xl md:text-7xl">
                    {t.hero.title}
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-600">
                    {t.hero.subtitle}
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link href="/register" className={PRIMARY_CTA}>
                        {t.hero.primaryCta}
                    </Link>
                    <Link href="/catalog" className={SECONDARY_CTA}>
                        {t.hero.secondaryCta}
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="mx-auto max-w-6xl px-5 sm:px-6">
                <div className="glass-panel grid grid-cols-2 gap-6 rounded-2xl px-6 py-8 sm:grid-cols-4 sm:px-10">
                    {t.stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="font-serif text-4xl font-semibold text-brand-800">{stat.value}</p>
                            <p className="mt-1 text-sm text-brand-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-serif text-4xl font-semibold text-brand-900">{t.values.title}</h2>
                    <p className="mt-3 text-brand-600">
                        {t.values.subtitle}
                    </p>
                </div>
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {t.values.items.map(({ title, description }, i) => {
                        const Icon = VALUE_ICONS[i];

                        return (
                            <div
                                key={title}
                                className="glass-panel p-6 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
                            >
                                <span className="inline-flex h-12 w-12 items-center justify-center border-2 border-brand-950 bg-gold-400 text-brand-950">
                                    <Icon fontSize="medium" />
                                </span>
                                <h3 className="mt-5 font-serif text-2xl font-semibold text-brand-900">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-brand-600">{description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* About */}
            <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
                <div className="glass-panel grid gap-8 rounded-3xl p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">{t.about.tagline}</p>
                        <h2 className="mt-3 font-serif text-4xl font-semibold text-brand-900">
                            {t.about.title}
                        </h2>
                    </div>
                    <div className="space-y-4 text-brand-600">
                        <p>{t.about.paragraph1}</p>
                        <p>{t.about.paragraph2}</p>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-6">
                <div className="border-4 border-brand-950 bg-brand-900 px-8 py-14 text-center brutal-shadow-lg sm:px-12">
                    <h2 className="font-serif text-4xl font-bold text-gold-50 sm:text-5xl">
                        {t.cta.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-brand-100">
                        {user ? t.cta.subtitleLoggedIn : t.cta.subtitleLoggedOut}
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        {user ? (
                            <>
                                <Link href="/catalog" className={CTA_SOLID}>
                                    {t.cta.exploreCatalog}
                                </Link>
                                <SignOutButton className={CTA_OUTLINE}>{t.cta.signOut}</SignOutButton>
                            </>
                        ) : (
                            <>
                                <Link href="/register" className={CTA_SOLID}>
                                    {t.cta.createAccount}
                                </Link>
                                <Link href="/login" className={CTA_OUTLINE}>
                                    {t.cta.signIn}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t-4 border-brand-950 bg-sand-50">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-brand-600 sm:flex-row sm:px-6">
                    <p className="font-serif text-base font-bold tracking-[0.15em] text-brand-900 uppercase">
                        {t.footer.brandName}
                    </p>
                    <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
                </div>
            </footer>
        </div>
    );
}
