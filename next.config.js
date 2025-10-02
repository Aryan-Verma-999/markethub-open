const nextConfig = {
reactStrictMode: true,
images: {
domains: [process.env.NEXT_PUBLIC_IMAGE_DOMAIN || 'localhost'],
},
}
module.exports = nextConfig