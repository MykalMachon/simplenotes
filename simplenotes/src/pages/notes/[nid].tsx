import RealtimeNote from '@/components/RealtimeNote';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

type NotePageProps = {
  note: any;
  editMode: boolean;
};

const DynamicEditorForm = dynamic(() => import('@/components/EditorForm'), {
  loading: () => <p>loading...</p>,
  ssr: false,
});

const NotePage = ({ note, editMode }: NotePageProps) => {
  const router = useRouter();
  const { nid } = router.query;

  useEffect(() => {
    console.log(`Client note id is ${nid}`);
  }, []);

  if (editMode) {
    return (
      <>
        <p><Link href="/">go back home 🏡</Link></p>
        <DynamicEditorForm noteId={note.id} />
      </>
    );
  } else {
    return <RealtimeNote noteId={note.id} />;
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;

  // get supabase auth info
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs
  const supabaseServer = createServerSupabaseClient(context);
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  // get the note in question from the database
  const { data, error } = await supabaseServer
    .from('notes')
    .select('*')
    .eq('id', params?.nid);

  // if there is an error, redirect to the homepage
  // TODO: show an error message
  if (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // if there isn't a note with that ID, return to the home page
  // TODO: show an error message
  if (data.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // if there is a note, return it if they should have access
  if (data[0].is_public || user?.id === data[0].created_by) {
    return {
      props: { note: data[0], editMode: user?.id === data[0].created_by },
    };
  } else {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export default NotePage;
