import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
// @ts-ignore
import GoogleServices from '../google-services.json';

function webClientId() {
  return GoogleServices.client
    .flatMap((client: any) => client.oauth_client)
    .filter((oauthClient: any) => oauthClient.client_type === 3);
}

export const useFirebaseGoogleAuth = () => {
  console.log(webClientId()[0].client_id)
  GoogleSignin.configure({
    webClientId: webClientId()[0].client_id,
    // webClientId: "837234367290-72d1mimhspp725qeunsdo56ji43tpql5.apps.googleusercontent.com"
  });
  const authenticateWithGoogle = async () => {
    const hasPlayServices = await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });
    if (hasPlayServices) {
      try {
        const { data } = await GoogleSignin.signIn();
        if (!data?.idToken) {
          throw new Error('idToken not found');
        }
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(
          data.idToken,
        );
        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
      } catch (error) {
        throw error;
      }
    }
  };

  return {
    authenticateWithGoogle,
  };
};

export default useFirebaseGoogleAuth;
