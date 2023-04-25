import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

const Notes = () => {
  const supabase = useSupabaseClient();
  const [notes, setNotes] = useState<any>(null);

  const fetchNotes = async () => {
    const { data, error } = await supabase.from('notes').select('*');
    if(error) console.log(error);
    if(data) setNotes(data);
  }

  useEffect(() => {
    fetchNotes();
  }, [])

  return (
    <div>
      <h1>Notes</h1>
      <section>
        {notes === null ? (<p>loading...</p>) : (
          <>
            {notes.length === 0 ? 
            (<p>no notes found.</p>) : (
              <ul>
                {notes.map((note: any) => (
                  <li key={note.id}>{note.id}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  )
}

export default Notes;