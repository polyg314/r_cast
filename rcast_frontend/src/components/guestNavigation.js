
import * as React from 'react';
import LoginScreen from "../screens/loginScreen"


export default function GuestNavigation(props) {
  return (

        <LoginScreen 
          setAccessToken={props.setAccessToken}
          setRefreshToken={props.setRefreshToken}
          setExpirationTime={props.setExpirationTime}
          setRcastUserInfo={props.setRcastUserInfo}
          setRcastToken={props.setRcastToken}
          setLoading={props.setLoading}
        />


  );
}