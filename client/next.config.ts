import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/core/localisation/request.ts");

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'xhmbhhcvzohckceuhbvc.supabase.co',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
