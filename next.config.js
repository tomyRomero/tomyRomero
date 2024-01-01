/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreDuringBuilds: true,
    },
    webpack: {
        ignoreDuringBuilds: true,
    }

}

module.exports = nextConfig
