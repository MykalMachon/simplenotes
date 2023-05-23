import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

const Notes = () => {
  const supabase = useSupabaseClient();
  const [notes, setNotes] = useState<any>(null);

  const fetchNotes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('created_by', user.id || '*');
      if (error) console.log(error);
      if (data) setNotes(data);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
      <section className="">
        {notes === null ? (
          <p>loading...</p>
        ) : (
          <>
            {notes.length === 0 ? (
              <p>no notes found.</p>
            ) : (
              <ul className="notes-list">
                {notes.map((note: any) => (
                  <li key={note.id}>
                    <a href={`/notes/${note.id}`}>{note.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
  );
};

export default Notes;
