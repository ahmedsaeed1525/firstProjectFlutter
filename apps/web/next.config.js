/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["shared", "ui"], // To transpile local packages
};

module.exports = nextConfig;
