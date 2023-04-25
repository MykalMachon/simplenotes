import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

type PostProps = {
  note: any;
};

const Post = ({ note }: PostProps) => {
  const router = useRouter();
  const { nid } = router.query;

  useEffect(() => {
    console.log(`Client note id is ${nid}`);
  }, []);

  return <main dangerouslySetInnerHTML={{ __html: note.content.html }} />;
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

  console.log(`signed in as ${user?.email}`);
  console.log(data);

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
      props: { note: data[0] },
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

export default Post;
