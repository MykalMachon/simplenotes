import { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';

type AuthorCardProps = {
  profileId: string;
};

const AuthorCard = ({ profileId }: AuthorCardProps) => {
  const supabase = useSupabaseClient();

  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId);

      if (error) {
        toast('failed to load profile');
        console.error(error);
      }
      if (data) {
        setProfile(data[0]);
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  if (loading) {
    return <p>loading...</p>;
  } else {
    return (
      <div className="author-card">
        <img src={profile.avatar_url} alt={profile.full_name} />
        <div>
          <small>written by</small>
        <p>{profile.full_name}</p>
        </div>
      </div>
    );
  }
};

export default AuthorCard;
