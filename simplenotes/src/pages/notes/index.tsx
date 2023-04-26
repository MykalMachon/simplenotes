import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';

type NoteListPageProps = {
  notes: Array<any>;
};

const Post = ({ notes }: NoteListPageProps) => {
  if (notes.length === 0) {
    return <p>No notes! try creating a note.</p>;
  } else {
    return (
      <main>
        <h1>Your notes</h1>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <a href={`/notes/${note.id}`}>{note.title}</a>
            </li>
          ))}
        </ul>
      </main>
    );
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // get supabase auth info
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs
  const supabaseServer = createServerSupabaseClient(context);
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  // if there isn't a user, redirect to the homepage
  // TODO: redirect to the login page
  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // get all the users notes
  const { data, error } = await supabaseServer
    .from('notes')
    .select('*')
    .eq('created_by', user.id);

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

  return {
    props: { notes: data },
  };
};

export default Post;
