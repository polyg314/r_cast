import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button, View } from 'react-native';
import LoginScreen from './src/screens/loginScreen';
import Main from './src/components/main';

import 'react-native-gesture-handler';



export default function App() {


  return (

      <Main></Main>


  );
}