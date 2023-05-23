import { AppProps } from 'next/app';

import { useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

import '../styles/globals.css';
import MainLayout from '@/components/MainLayout';

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <style jsx global>{`
        html: {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <div className={inter.className}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </div>
    </SessionContextProvider>
  );
}

export default MyApp;
