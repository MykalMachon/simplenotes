import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useState } from 'react';

type NewNoteButtonProps = {
  title: {
    idle: string;
    loading: string;
  };
  style: 'primary' | 'secondary';
};

const NewNoteButton = ({ title, style }: NewNoteButtonProps) => {
  const router = useRouter();
  const session = useSession();
  const supabase = useSupabaseClient();

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState(title.idle);

  const createNewNote = async () => {
    const { data, error } = await supabase
      .from('notes')
      .insert({ title: 'new note', created_by: session?.user.id })
      .select();
    if (error) {
      alert('could not create a new note 🥲');
      setButtonDisabled(false);
      setButtonText(title.idle);
      return;
    } else {
      router.push(`/notes/${data[0].id}`);
    }
  };

  const handleCreateNewNote = async (e: any) => {
    e.preventDefault();
    setButtonDisabled(true);
    setButtonText(title.loading);
    await createNewNote();
  };

  return (
    <button
      className={`btn--${style}`}
      title={buttonText}
      disabled={buttonDisabled}
      onClick={handleCreateNewNote}
    >
      {buttonText}
    </button>
  );
};

export default NewNoteButton;
