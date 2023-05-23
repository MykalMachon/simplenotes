import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps } from 'next';

const Login = () => {
  const supabase = useSupabaseClient();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login or Sign-up</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={['discord', 'github']}
          redirectTo={process.env.NEXT_PUBLIC_REDIRECT_URL}
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
