import * as React from 'react';
import { View, Text } from "react-native";

import { Button } from '@rneui/themed';


import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession();



export default function LoginScreen() {


const [request, response, promptAsync] = useAuthRequest(
    {
        clientId: '2032e93e5d6b4466a81a2fd6152cd0a6',
        scopes: ['user-read-email', 'playlist-modify-public'],
        // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
        // this must be set to false
        usePKCE: false,
        redirectUri: makeRedirectUri({
        scheme: 'your.app'
        }),
    },
    discovery
    );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log("CODE")
      console.log(code)
    }
  }, [response]);

  




   return (
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                <Button
                title="Log In"
                onPress={() => {
                    logInUser();
                }}
                type="outline"
                /> 

                
</View>
   );
 }