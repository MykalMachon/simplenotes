import 'trix';
import 'trix/dist/trix.css';

import { useEffect, useMemo, useState } from 'react';
import { TrixEditor } from 'react-trix';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const debounce = (func: Function, timeout = 1000) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

type EditorFormProps = {
  noteId: number;
};

const EditorForm = ({ noteId }: EditorFormProps) => {
  const supabase = useSupabaseClient();
  const [initNote, setInitNote] = useState<any>(null);

  const loadNoteData = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId);
    if (error) console.log(error);
    if (data) {
      console.log(data);
      setInitNote(data[0]);
    }
  };

  useEffect(() => {
    loadNoteData();
  }, []);

  const handleEditorReady = (editor: any) => {
    // TODO: unlock and show the editor...
  };

  const commitChanges = async (html: string | null) => {
    // if(html) console.log(html);
    const { error } = await supabase
      .from('notes')
      .update({ content: { html: html } })
      .eq('id', 1);
    if (error) console.log(error);
  };

  // push the notes content changes up to the database after 1 second without changes.
  // TODO: create a way to listen for "is saved state" and show it in the UI.
  const debouncedCommitChanges = useMemo(() => debounce(commitChanges), []);

  const handleChange = (html: string, text: string) => {
    console.log('changing html...');
    debouncedCommitChanges(html);
  };

  return (
    <>
      {initNote === null ? (
        <p>loading...</p>
      ) : (
        <>
          <h1>Editing: {initNote.title}</h1>
          {initNote === null ? (
            <p>loading...</p>
          ) : (
            <TrixEditor
              onChange={handleChange}
              onEditorReady={handleEditorReady}
              value={initNote?.content?.html}
              mergeTags={[]}
            />
          )}
        </>
      )}
    </>
  );
};

export default EditorForm;
