import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["grm-upload.getter.uz", "s3.gilam-market.uz"],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["antd", "lucide-react", "react-masonry-css", "leaflet", "react-leaflet"],
  },
};

export default withNextIntl(nextConfig);
