import type { NextConfig } from "next";

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

export default nextConfig;
