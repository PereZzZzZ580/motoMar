 // src/app/providers.tsx

 'use client';

import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export function Providers({ children }: { children: React.ReactNode }) {
 useEffect(() => {
    const modoOscuroGuardado = localStorage.getItem('modoOscuro') === 'true';
    document.documentElement.classList.toggle('modo-oscuro', modoOscuroGuardado);
    document.body.classList.toggle('modo-oscuro', modoOscuroGuardado);
  }, []);
  return (
    <>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.75 }}
      >
        {children}
      </motion.main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}