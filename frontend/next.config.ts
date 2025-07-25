import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
reactStrictMode: true,

   images: {

    domains: [
      'res.cloudinary.com', // Dominio de Cloudinary
      'images.unsplash.com', // Dominio de Unsplash (placeholder de prueba)
      'localhost',          // Permite imágenes desde localhost
      'moto-mar.com',       // Dominio del sitio
      'www.moto-mar.com',   // Dominio del sitio con www
      'moto-mar.vercel.app', // Dominio de Vercel
      'moto-mar-backend.vercel.app' // Dominio del backend en Vercel
    ],

    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',  // Permite cualquier imagen bajo /uploads
      },
            {
        protocol: 'http',
        hostname: 'moto-mar-backend.vercel.app',
        pathname: '/uploads/**',  // Permite cualquier imagen bajo /uploads
      },
    ],
  },
};


export default nextConfig;
