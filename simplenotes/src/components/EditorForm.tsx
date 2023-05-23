import 'trix';
import 'trix/dist/trix.css';

import { useEffect, useMemo, useState } from 'react';
import { TrixEditor } from 'react-trix';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import NoteMetaData from '../components/NoteMetaData';
import { toast } from 'react-hot-toast';

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
    if (error) {
      alert('failed to load note...');
      console.log(error);
    }
    if (data) {
      setInitNote(data[0]);
    }
  };

  useEffect(() => {
    loadNoteData();
  }, []);

  const handleEditorReady = (editor: any) => {
    // TODO: unlock and show the editor...
  };

  const commitNoteChanges = async (html: string | null) => {
    const { data, error } = await supabase
      .from('notes')
      .update({ content: { html: html } })
      .eq('id', noteId)
      .select();
    if (error) {
      toast.error('failed to save your note')
      console.log(error);
    }
    if (data) {
      toast.success('Note saved!');
      setInitNote(data[0]);
    }
  };

  const commitMetaChanges = async (title: string, value: any) => {
    // todo: do this but better.
    if (typeof value == 'string' && value.trim() === '') {
      toast.error('Title cannot be empty');
      return;
    }

    const { data, error } = await supabase
      .from('notes')
      .update({ [title]: value })
      .eq('id', noteId)
      .select();
    if (error) {
      toast.error('failed to save your note')
      console.log(error);
    }
    if (data) {
      setInitNote(data[0]);
      toast.success(`Note ${title} saved!`);
    }
  };

  // push the notes content changes up to the database after 1 second without changes.
  // TODO: create a way to listen for "is saved state" and show it in the UI.
  const debouncedCommitNoteChanges = useMemo(
    () => debounce(commitNoteChanges),
    []
  );

  const debouncedCommitMetaChanges = useMemo(
    () => debounce(commitMetaChanges),
    []
  );

  const handleMetaChange = (event: any) => {
    const { name, value, checked } = event.target;
    debouncedCommitMetaChanges(name, name === 'is_public' ? checked : value);
  };

  const handleChange = (html: string, text: string) => {
    debouncedCommitNoteChanges(html);
  };

  return (
    <>
      {initNote === null ? (
        <p>loading...</p>
      ) : (
        <>
          {initNote === null ? (
            <p>loading...</p>
          ) : (
            <div>
              <form
                onChange={handleMetaChange}
                onSubmit={(e) => e.preventDefault()}
              >
                <label htmlFor="title">
                  Note Title:
                  <input
                    type="text"
                    name="title"
                    id="title"
                    defaultValue={initNote?.title}
                  />
                </label>
                <label htmlFor="is_public">
                  Public?
                  <input
                    type="checkbox"
                    name="is_public"
                    id="is_public"
                    defaultChecked={initNote?.is_public}
                  />
                </label>
              </form>
              <TrixEditor
                onChange={handleChange}
                onEditorReady={handleEditorReady}
                value={initNote?.content?.html}
                mergeTags={[]}
              />
              <NoteMetaData noteData={initNote} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default EditorForm;
