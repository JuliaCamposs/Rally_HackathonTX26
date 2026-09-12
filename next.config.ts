import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-leaflet v5 creates the Leaflet map in a ref callback and removes it
  // in an effect cleanup; StrictMode's simulated unmount destroys the map and
  // it is never recreated (dev only). Disabled so the map survives in dev.
  reactStrictMode: false,
  experimental: { workerThreads: true, cpus: 2, useTypeScriptCli: false, webpackBuildWorker: false },
  // The preview/browser may reach the dev server via a different origin than
  // it binds to; without this, Next blocks /_next/hmr and hydration stalls.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
