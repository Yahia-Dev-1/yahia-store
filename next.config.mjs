/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
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
