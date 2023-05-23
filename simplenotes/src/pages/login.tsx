import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

const Login = () => {
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    // wait for sign-in event, redirect to home page on good login
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event == 'SIGNED_IN') {
          toast.success('Logged in!');
          router.push('/');
        }
      }
    );
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login or Sign-up</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['discord', 'github']}
          redirectTo="/"
        />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabaseServer = createServerSupabaseClient(context);
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Login;
