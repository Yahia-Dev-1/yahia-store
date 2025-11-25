/** @type {import('next').NextConfig} */
const nextConfig = {
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
