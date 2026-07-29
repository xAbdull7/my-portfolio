import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  customWorkerSrc: "worker",
});

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withPWA(nextConfig);
