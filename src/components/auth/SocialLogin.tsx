import useAuthAPI from '@/hooks/useAuthAPI'
import FacebookButton from './Button/FacebookButton';
import GoogleButton from './Button/GoogleButton';
import { useGoogleLogin, type TokenResponse } from '@react-oauth/google';
import FacebookLogin, { type SuccessResponse } from '@greatsumini/react-facebook-login';

const SocialLogin = () => {
  const { handleGoogleLogin, handleFacebookLogin } = useAuthAPI();

   const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      await handleGoogleLogin(tokenResponse);
    },
    onError: () => {
      console.log('Google login failed');
    },
  });
  return (
    <div className="flex flex-col justify-center gap-1">
      <GoogleButton onClick={googleLogin} />
      <FacebookLogin
        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
        onSuccess={(response: SuccessResponse ) => handleFacebookLogin(response)}
        onFail={(error) => console.log('Login Failed!', error)}
         render={(renderProps) => (
          <FacebookButton
            onClick={renderProps.onClick ?? (() => {})}
          />
        )}
      />
      
    </div>
  )
}

export default SocialLogin