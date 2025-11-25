/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/yahia-store',
    assetPrefix: '/yahia-store/',
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Allow all for now to support various CDNs
            },
        ],
    },
};

export default nextConfig;
