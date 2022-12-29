
import { View, Text } from 'react-native';

import { _storeData, _retrieveData } from "../utils/storage"
import { Button } from '@rneui/themed';

import axios from "axios"


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

const getDevices = async (token) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
      method: 'GET',
      headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      }
  });
  const responseJson = response.json();
  return responseJson
}

const stopStart = async (token) => {
    try {
      let res = await axios({
  // ?device_id=5a5861766cabad6f411acdf198f2f9738cdb054c
          url: 'https://api.spotify.com/v1/me/player/play',
          method: 'PUT',
          timeout: 8000,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          data: {
                  "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
                  "offset": {
                    "position": 1
                  },
                  "position_ms": 0
          }
      })
      if(res.status === 200){

          return res
      }    
      return null
  }
  catch (err) {
      console.error('There was an error!', err);
      return null
  }


  // const response = await fetch('https://api.spotify.com/v1/me/player/play', {
  //     method: 'PUT',
  //     headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //     },
  //     json: JSON.stringify({
  //       "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
  //       "offset": {
  //         "position": 5
  //       },
  //       "position_ms": 0
  //     })
  // });
  // const responseJson = response.json();
  // return responseJson
}

const handleGetDevices = () => {
  _retrieveData('accessToken').then(token => {
    console.log("TOKEN")
    console.log(token)
    getDevices(token).then(devices => {
      console.log("DEVICES")
      console.log(devices)
    })
  })

}

const handleStopStart = () => {
  _retrieveData('accessToken').then(token => {
    stopStart(token).then(stopStartRes => {
      console.log("STOP START")
      console.log(stopStartRes)
    })
  })

}

export default function UserFeed(props) {
  console.log(props)
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>USER FEED for {props.rcastUserInfo.email}</Text>
        <Button
                title="Devices"
                onPress={() => {
                  handleGetDevices();
                }}
                type="outline"
                />
          <Button
                title="Stop Start"
                onPress={() => {
                  handleStopStart();
                }}
                type="outline"
                />
      </View>
    )
}