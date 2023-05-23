import Head from 'next/head';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { GetServerSideProps } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import Notes from '@/components/Notes';
import NewNoteButton from '@/components/NewNoteButton';

export default function Home({ notes, error }) {
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
      {error && <p>{error}</p>}
      <NewNoteButton
        title={{ idle: 'New note', loading: 'creating...' }}
        style="primary"
      />
      <Notes notes={notes} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabaseServer = createServerSupabaseClient(context);
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // fetch the users notes
  const { data, error } = await supabaseServer
    .from('notes')
    .select('*')
    .eq('created_by', user.id);
  if (error) {
    return {
      props: {
        note: null,
        error: "couldn't grab your notes... try again!",
      },
    };
  }

  return {
    props: {
      notes: data,
    },
  };
};
