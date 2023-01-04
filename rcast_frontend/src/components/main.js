import { _storeData, _retrieveData } from "../utils/storage"
import { View } from 'react-native';
import * as React from 'react';
import { API_ENDPOINT } from "../utils/constants"
import axios from 'axios'
import UserNavigation from "./userNavigation";

import GuestNavigation from "./guestNavigation";

import { Button } from '@rneui/themed';

import { NavigationContainer } from '@react-navigation/native';
import getRcastUserInfo from "../API/getRcastUserInfo";




const getSpotifyCredentials = async () => {
    const res = await axios.get(API_ENDPOINT + '/api/spotify-credentials')
    const spotifyCredentials = res.data
    return spotifyCredentials
}


const refreshTokens = async (credentials, refreshToken) => {
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    const response = await fetch('https://accounts.spotify.com/api/token', {
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


const getUserInfo = async (token) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    const responseJson = response.json();
    return responseJson
}

export default function Main() {




    const [accessToken, setAccessToken] = React.useState('')
    const [refreshToken, setRefreshToken] = React.useState('')
    const [expirationTime, setExpirationTime] = React.useState(0)
    const [rcastUserInfo, setRcastUserInfo] = React.useState({})
    const [rcastToken, setRcastToken] = React.useState('')
    const [loading, setLoading] = React.useState(true)


    function isExpired(expTime) {
        if (new Date().getTime() > expTime) {
            return true
        } else {
            return false
        }

    }


    const tokenRefreshWorkflow = () => {

        try {
            var accessTokenTemp = '';
            var refreshTokenTemp = '';
            var expirationTimeTemp = '';



            // var rcastUserInfoTemp = {}
            // var rcastTokenTemp = ''
            // _retrieveData('rcastToken').then(aToken => {
            //     _retrieveData('rcastUserInfo').then(rInfo => {
            //         if(rInfo !== undefined && (rInfo !== "undefined")){
            //             rcastUserInfoTemp = JSON.parse()
            //         }
                    
            //     })
            // })

            _retrieveData('accessToken').then(aToken => {
                accessTokenTemp = aToken
                _retrieveData('refreshToken').then(rToken => {
                    refreshTokenTemp = rToken
                    _retrieveData('expirationTime').then(eTime => {
                        expirationTimeTemp = eTime
                        console.log("hi?")
                        console.log(refreshTokenTemp)
                        if ((accessTokenTemp !== undefined) && (refreshTokenTemp !== undefined) && (expirationTimeTemp !== undefined) 
                         && (accessTokenTemp !== "undefined") && (refreshTokenTemp !== "undefined")
                            ) {
                            if(accessTokenTemp.length > 0 && refreshTokenTemp.length > 0){
                                if (isExpired(expirationTimeTemp)) {
                                    /// REFRESH TOKENS
                                    getSpotifyCredentials().then(credentials => {
                                        console.log("REF")
                                        console.log(refreshTokenTemp)
                                        refreshTokens(credentials, refreshTokenTemp).then(responseJson => {
                                            console.log("Response JSON")
                                            console.log(responseJson)
                                            if (Object.keys(responseJson).includes("expires_in")) {
                                                if (responseJson["expires_in"]) {
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

                                                    console.log("loading?")
                                                    getUserInfo(accessTokenNew).then(userInfo => {
                                                        console.log("UI RES")
                                                        console.log(userInfo)
                                                        getRcastUserInfo(userInfo).then(rcastUserInfoRes => {
                                                            _storeData('rcastUserInfo', JSON.stringify(rcastUserInfoRes.data.user))
                                                            _storeData('rcastToken', rcastUserInfoRes.data.rcastToken)
                                                            setRcastUserInfo(rcastUserInfoRes.data.user)
                                                            setRcastToken(rcastUserInfoRes.data.rcastToken)
                                                            setLoading(false)
                                                        })
                                                    })
                                                    //  user workflow here 
                                                    return true
                                                }
                                            } else {
                                                setLoading(false)
                                            }
    
    
                                        })
                                    })
    
                                } else {
                                    // user workflow here 
                                    getUserInfo(accessTokenTemp).then(userInfo => {
                                        getRcastUserInfo(userInfo).then(rcastUserInfoRes => {
                                            console.log("RESSSS")
                                            console.log(rcastUserInfoRes)
                                            if(rcastUserInfoRes !== null){
                                                _storeData('rcastUserInfo', JSON.stringify(rcastUserInfoRes.data.user))
                                                _storeData('rcastToken', rcastUserInfoRes.data.rcastToken)
                                                setRcastUserInfo(rcastUserInfoRes.data.user)
                                                setRcastToken(rcastUserInfoRes.data.rcastToken)
                                            }

                                            setLoading(false)
                                        })
                                    })
                                    if (accessTokenTemp !== accessToken) {
                                        setAccessToken(accessTokenTemp)
                                    }
                                    if (refreshToken !== refreshTokenTemp) {
                                        setRefreshToken(refreshTokenTemp)
                                    }
                                    if (expirationTime !== expirationTimeTemp) {
                                        setExpirationTime(expirationTimeTemp)
                                    }
                                    setLoading(false)
                                    console.log("loading?")
                                    return true
                                }
                            }else{
                                setLoading(false)
                            }



                        } else {
                            setLoading(false)
                        }

                    })
                });
            });
        } catch (err) {
            setLoading(false)
            return false
        }

    }

    React.useEffect(() => {
        console.log("MAIN USE EFFECT BEING CALLED")
        tokenRefreshWorkflow()
        
    }, [])


    const logOutUser = () => {
        _storeData('accessToken', '');
        _storeData('refreshToken', '');
        _storeData('expirationTime', '');
        _storeData('rcastUserInfo', '');
        _storeData('rcastToken', '')
        setRcastUserInfo({})
        setAccessToken('')
        setRefreshToken('')
        setExpirationTime(0)
        setRcastToken('')
    }
    return (
        <NavigationContainer>

            {accessToken && refreshToken && expirationTime && !loading &&


                <UserNavigation
                    logOutUser={logOutUser}
                    rcastUserInfo={rcastUserInfo}
                >
                </UserNavigation>



            }
            {!accessToken && isExpired(expirationTime) && !loading &&
                <GuestNavigation
                    setAccessToken={setAccessToken}
                    setRefreshToken={setRefreshToken}
                    setExpirationTime={setExpirationTime}
                    setRcastUserInfo={setRcastUserInfo}
                    setRcastToken={setRcastToken}
                    setLoading={setLoading}

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