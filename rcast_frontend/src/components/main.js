import {_storeData, _retrieveData} from "../utils/storage"
import { View } from 'react-native';
import * as React from 'react';
import { API_ENDPOINT } from "../utils/constants"
import axios from 'axios'
import UserNavigation from "./userNavigation";

import GuestNavigation from "./guestNavigation";

import { Button } from '@rneui/themed';

import { NavigationContainer } from '@react-navigation/native';




const getSpotifyCredentials = async () => {
    const res = await axios.get(API_ENDPOINT + '/api/spotify-credentials')
    const spotifyCredentials = res.data
    return spotifyCredentials
  }


const refreshTokens  = async(credentials, refreshToken) => {
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    const response =  await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = response.json();
    return responseJson
}


export default function Main() {


    const [accessToken, setAccessToken] = React.useState('')
    const [refreshToken, setRefreshToken] = React.useState('')
    const [expirationTime , setExpirationTime ] = React.useState(0)
    const [loading, setLoading] = React.useState(true)


    function isExpired(expTime){
        if(new Date().getTime() > expTime){
            return true
        }else{
            return false
        }
        
    }


    const tokenRefreshWorkflow = () => {
       
        try{
            var accessTokenTemp = '';
            var refreshTokenTemp = '';
            var expirationTimeTemp = '';
            
            _retrieveData('accessToken').then(aToken => {
                accessTokenTemp = aToken
                _retrieveData('refreshToken').then(rToken => {
                    refreshTokenTemp = rToken
                    _retrieveData('expirationTime').then(eTime => {
                        expirationTimeTemp = eTime
                        console.log("hi?")
                        if(accessTokenTemp && refreshTokenTemp && expirationTimeTemp){
                            console.log("muaahhh")
                            console.log(expirationTimeTemp)
    
                            if (isExpired(expirationTimeTemp)) {
                                /// REFRESH TOKENS
                                getSpotifyCredentials().then(credentials => {
                                    refreshTokens(credentials, refreshTokenTemp).then(responseJson => {
                                        console.log("Response JSON")
                                        console.log(responseJson)
                                        if(Object.keys(responseJson).includes("expires_in")){
                                            if(responseJson["expires_in"]){
                                                const {
                                                    access_token: accessTokenNew,
                                                    refresh_token: refreshTokenNew,
                                                    expires_in: expiresInNew,
                                                  } = responseJson;
                                                  const expirationTimeNew = new Date().getTime() + expiresInNew * 1000;
                                                  _storeData('accessToken', accessTokenNew);
                                                  _storeData('refreshToken', refreshTokenNew);
                                                  _storeData('expirationTime', expirationTimeNew);
                                                  setAccessToken(accessTokenTemp)
                                                  setRefreshToken(refreshTokenTemp)
                                                  setExpirationTime(expirationTimeTemp)
                                                  setLoading(false)
                                                  console.log("loading?")
                                                  return true
                                            }
                                        }else{
                                            setLoading(false)
                                        }
    
        
                                    })
                                })
    
                            } else {
                                if(accessTokenTemp !== accessToken){
                                    setAccessToken(accessTokenTemp)
                                }
                                if(refreshToken !== refreshTokenTemp){
                                    setRefreshToken(refreshTokenTemp)
                                }
                                if(expirationTime !== expirationTimeTemp){
                                    setExpirationTime(expirationTimeTemp)
                                }
                                setLoading(false)
                                console.log("loading?")
                                return true
                            }
                        }else{
                            setLoading(false)
                        }
                        
                    })
                });
            });
        }catch(err){
            setLoading(false)
            return false
        }

    }

    React.useEffect(() => {
        tokenRefreshWorkflow()
    },[])


    const logOutUser = () => {
        _storeData('accessToken', '');
        _storeData('refreshToken', '');
        _storeData('expirationTime','');
        setAccessToken('')
        setRefreshToken('')
        setExpirationTime(0)
    }
    return(
        <NavigationContainer>

            {accessToken && refreshToken && expirationTime && !loading && 
    
                <>
                <UserNavigation
                logOutUser={logOutUser}
                >

                </UserNavigation>

                </>

            }
            {!accessToken && isExpired(expirationTime) && !loading && 
                <GuestNavigation
                    setAccessToken={setAccessToken}
                    setRefreshToken={setRefreshToken}
                    setExpirationTime={setExpirationTime}
                >

                </GuestNavigation>
            }{loading &&
                <View>
                    <h1>Loading.....</h1>
                </View>


            }

        </NavigationContainer>
    )
}