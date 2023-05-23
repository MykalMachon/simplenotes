import Head from 'next/head';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import Notes from '@/components/Notes';
import { useRouter } from 'next/router';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import MainLayout from '@/components/MainLayout';
import NewNoteButton from '@/components/NewNoteButton';

export default function Home() {
  const session = useSession();
  const supabase = useSupabaseClient();

  return (
    <>
      <Head>
        <title>Simple Notes</title>
        <meta
          name="description"
          content="a simple notes app made to share notes online easily"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        {!session ? (
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={['discord', 'github']}
            redirectTo={process.env.NEXT_PUBLIC_REDIRECT_URL}
          />
        ) : (
          <>
            <NewNoteButton
              title={{ idle: 'New note', loading: 'creating...' }}
              style="primary"
            />
            <Notes />
          </>
        )}
      </>
    </>
  );
}
