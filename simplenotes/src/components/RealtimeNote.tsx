import { useEffect, useMemo, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import AuthorCard from './AuthorCard';

type RealtimeNotes = {
  noteId: number;
};

const RealtimeNote = ({ noteId }: RealtimeNotes) => {
  const supabase = useSupabaseClient();
  const [note, setNote] = useState<any>(null);

  const loadNoteData = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId);
    if (error) console.log(error);
    if (data) {
      console.log(data);
      setNote(data[0]);
    }
  };

  const subscribeToNote = async () => {
    supabase
      .channel('any')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notes',
          filter: `id=eq.${noteId}`,
        },
        (payload) => {
          if(payload.eventType === 'UPDATE'){
            setNote(payload.new);
          }
        }
      )
      .subscribe();
  };

  useEffect(() => {
    loadNoteData();
    subscribeToNote();
  }, []);

  return (
    <>
      {note === null ? (
        <p>loading...</p>
      ) : (
        <div className="realtime-note">
          <h1>{note.title}</h1>
          <AuthorCard profileId={note.created_by} />
          <hr />
          <article dangerouslySetInnerHTML={{ __html: note?.content?.html }}></article>
        </div>
      )}
    </>
  );
};

export default RealtimeNote;
