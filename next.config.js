/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
      // {
      //   source: '/app/[code]',
      //   destination: '/app/[code]/'
      // }
    ];
  },
};

module.exports = nextConfig;
