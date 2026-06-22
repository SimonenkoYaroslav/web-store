const en = {
    forbiddenPage: {
        code: '403',
        title: 'Access denied',
        description: "You don't have permission to view this page.",
        backLink: 'Back to catalog',
    },
    homePage: {
        metadata: {
            title: 'Web Store — Curated Goods, Delivered',
            description:
                'Web Store is a modern shop for curated, premium goods — secure checkout, fast delivery, and a refined buying experience.',
        },
        header: {
            brandName: 'Web_Store',
            enterStore: 'Enter store',
            signOut: 'Sign out',
            signIn: 'Sign in',
            createAccount: 'Create account',
        },
        hero: {
            tagline: 'Curated goods, delivered',
            title: 'A refined way to shop for the things you love',
            subtitle:
                'Web Store brings together a tightly curated catalog of premium products with a checkout experience that feels effortless. Less noise, better things.',
            primaryCta: 'Get started',
            secondaryCta: 'Explore the catalog',
        },
        stats: [
            { value: '500+', label: 'Curated products' },
            { value: '12k+', label: 'Happy customers' },
            { value: '30+', label: 'Countries served' },
            { value: '4.9★', label: 'Average rating' },
        ],
        values: {
            title: 'Why shop with us',
            subtitle:
                'We obsess over the details so your experience stays simple, secure, and genuinely enjoyable.',
            items: [
                {
                    title: 'Curated quality',
                    description:
                        'Every product is hand-picked and vetted, so the catalog stays small, deliberate, and worth your time.',
                },
                {
                    title: 'Secure checkout',
                    description:
                        'Payments are processed through Stripe with bank-grade encryption. Your details never touch our servers.',
                },
                {
                    title: 'Fast delivery',
                    description:
                        'Orders are dispatched within 24 hours and tracked end to end, from our warehouse to your door.',
                },
                {
                    title: 'Real support',
                    description:
                        'A human team is one message away — before, during, and long after your purchase.',
                },
            ],
        },
        about: {
            tagline: 'Our story',
            title: 'Built for people who care about what they buy',
            paragraph1:
                'We started Web Store with a simple belief: shopping online should feel as considered as the products themselves. So we keep the catalog small, partner only with makers we trust, and sweat every step from browse to delivery.',
            paragraph2:
                'Whether you are picking up a single piece or stocking up on the essentials, you get the same secure, fast, and friendly experience every time.',
        },
        cta: {
            title: 'Ready to start shopping?',
            subtitleLoggedIn: 'Jump back into the catalog and pick up where you left off.',
            subtitleLoggedOut: 'Create a free account in seconds and explore the full collection.',
            exploreCatalog: 'Explore the catalog',
            signOut: 'Sign out',
            createAccount: 'Create your account',
            signIn: 'Sign in',
        },
        footer: {
            brandName: 'Web_Store',
            copyright: 'Web Store. All rights reserved.',
        },
    },
} as const;

export default en;
