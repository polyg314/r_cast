import * as React from 'react';
import { View, Text } from "react-native";
import { API_ENDPOINT } from "../utils/constants"
import { Button } from '@rneui/themed';

import axios from 'axios'

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

import {_storeData, _retrieveData} from "../utils/storage"


WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };
  
  const getSpotifyCredentials = async () => {
    const res = await axios.get(API_ENDPOINT + '/api/spotify-credentials')
    const spotifyCredentials = res.data
    return spotifyCredentials
  }


const getTokens = async (credentials, authorizationCode) => {
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${authorizationCode}&redirect_uri=${
        credentials.redirectUri
      }`,
    });
    console.log("HI2")
    const responseJson =  response.json();
    return responseJson
}

export default function LoginScreen(props) {


    

const [request, response, promptAsync] = useAuthRequest(
    {
        clientId: '2032e93e5d6b4466a81a2fd6152cd0a6',
        scopes: ['user-read-email', 'playlist-modify-public'],
        // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
        // this must be set to false
        usePKCE: false,
        redirectUri: "http://127.0.0.1:19006"
    },
    discovery
    );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    //   console.log("CODE")
    //   console.log(code)

    try {
        getSpotifyCredentials().then(credentials => {
            getTokens(credentials, code).then(responseJson => {
                const {
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    expires_in: expiresIn,
                    } = responseJson;
                
                    const expirationTime = new Date().getTime() + expiresIn * 1000;
                    console.log("RESSSS")
                    console.log(responseJson)
                    _storeData('accessToken', accessToken);
                    _storeData('refreshToken', refreshToken);
                    _storeData('expirationTime', expirationTime);
                    props.setAccessToken(accessToken)
                    props.setRefreshToken(refreshToken)
                    props.setExpirationTime(expirationTime)
                    setLoading(false)
            })
        })

    } catch (err) {
        console.error(err);
    }
    }
  }, [response]);





   return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <Button
        title="Log In"
        onPress={() => {
            promptAsync();
        }}
        type="outline"
        /> 

                
</View>
   );
 }