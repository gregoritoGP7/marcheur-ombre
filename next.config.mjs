/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // La configuration PWA (service worker + manifest) sera branchée à l'étape
  // "mode hors ligne" une fois le socle applicatif stable, pour éviter de
  // déboguer un service worker en même temps que l'UI change encore.
};

export default nextConfig;
