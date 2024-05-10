/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone', 
    // Ovde sam isprobavao sve i svašta (i buildovao svaki put), bezuspešno.
    assetPrefix: 'https://www.codemonkeys.com/frontend',
    basePath: '/frontend'
};

export default nextConfig;
