
import { View, Text } from 'react-native';

import { _storeData, _retrieveData } from "../utils/storage"
import { Button, Overlay } from '@rneui/themed';

import axios from "axios"

import * as React from 'react';
import { MAIN_THEME_1, MAIN_THEME_2, MAIN_THEME_3, FONT_FAMILY } from '../utils/constants';

import { Image } from '@rneui/themed';
import { FlatList, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';

import { ButtonGroup, withTheme, } from '@rneui/themed';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { objectCopy } from '../utils/misc';

import { SpeedDial } from '@rneui/themed';



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


const handlePlaySong = (postItem) => {
  console.log("PLAYY")
  _retrieveData('accessToken').then(token => {
    playPost(token, postItem)
  })
}

const playPost = async (token, postItem) => {
  var dataObj = {}
  if (postItem.postType === "album" || postItem.postType === "playlist" || postItem.postType === "artist") {
    dataObj = {
      "context_uri": "spotify:" + postItem.postType + ":" + postItem.postSourceId,
    }
  } else if (postItem.postType === "track") {
    dataObj = {
      "uris": ["spotify:" + postItem.postType + ":" + postItem.postSourceId],
    }
  }
  console.log(dataObj)
  try {
    let res = await axios({
      // 
      url: 'https://api.spotify.com/v1/me/player/play?device_id=5a5861766cabad6f411acdf198f2f9738cdb054c',
      method: 'PUT',
      timeout: 8000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: dataObj
    })
    if (res.status === 200) {

      return res
    }
    return null
  }
  catch (err) {
    console.error('There was an error!', err);
    return null
  }

}

const stopStart = async (token) => {
  try {
    let res = await axios({
      // 
      url: 'https://api.spotify.com/v1/me/player/play?device_id=5a5861766cabad6f411acdf198f2f9738cdb054c',
      method: 'PUT',
      timeout: 8000,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
        "offset": {
          "position": 5
        },
        "position_ms": 0
      }
    })
    if (res.status === 200) {

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

const exampleFeed = [
  {
    "postSourceId": "4rOUCnPgp5QW9uAkAReJUa",
    "postUserComment": "",
    "postType": "track",
    "postImage": "https://i.scdn.co/image/ab67616d00004851fc29269d5349c3cd876d2dd8",
    "postTitle": "Step By Step - Axel Boman’s In The Air Version",
    "postArtist": "Braxe + Falcon, Panda Bear, Axel Boman, Alan Braxe, DJ Falcon",
    "postLength": "202480",
    "expanded": false,
    "open": false,
    "postId": 1
  },
  {
    "postSourceId": "76Z0bk37b87hdPwAjKowbN",
    "postUserComment": "",
    "postType": "playlist",
    "postImage": "https://i.scdn.co/image/ab67706c0000bebbe1af9195f4b752f7f0b25370",
    "postTitle": "Panda Bear 2000 - Now",
    "postArtist": "Panda Bear",
    "postLength": "33",
    "artist": "Panda Bear",
    "expanded": false,
    "open": false,
    "postId": 2
  },
  {
    "postSourceId": "20NAtKWWeyYn9QIzOejT0Y",
    "postUserComment": "",
    "postType": "album",
    "postImage": "https://i.scdn.co/image/ab67616d00004851e64ca5ff3e13ddb6cc84f527",
    "postTitle": "Reset",
    "postArtist": "Panda Bear, Sonic Boom",
    "postLength": "9",
    "expanded": false,
    "open": false,
    "postId": 3
  },
  {
    "postSourceId": "1R84VlXnFFULOsWWV8IrCQ",
    "postUserComment": "",
    "postType": "artist",
    "postImage": "https://i.scdn.co/image/ab6761610000f178b67328f1e1fee803bdf1d21e",
    "postTitle": "Panda Bear",
    "postArtist": "Panda Bear",
    "postLength": "",
    "expanded": false,
    "open": false,
    "postId": 4
  }
]

export default function UserFeed(props) {
  console.log(props)
  const [userFeed, setUserFeed] = React.useState(exampleFeed)
  const [visible, setVisible] = React.useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleChangeExpand = (postItem) => {
    var postsCopy = objectCopy(userFeed)
    postsCopy = postsCopy.map(post => post.postId = postItem.postId ? { ...post, expanded: !postItem.expanded } : { ...post })
    console.log(postsCopy)
    setUserFeed(postsCopy)
  }

  const handleChangeOpen = (postItem) => {
    var postsCopy = objectCopy(userFeed)
    postsCopy = postsCopy.map(post => post.postId = postItem.postId ? { ...post, open: !postItem.open } : { ...post })
    console.log(postsCopy)
    setUserFeed(postsCopy)
    toggleOverlay()
  }


  return (
    <View style={{ width: "100%", height: "100%", overflowY: "scroll" }}>

      {userFeed.map((postItem) => {
        return (
          <View style={{ width: "100%", display: "block", marginBottom: "5px" }}>
            <View style={{ width: "60px", backgroundColor: MAIN_THEME_1, float: "left", display: "inline-block", height: "60px", position: "relative" }}>
              <Image
                source={{ uri: postItem.postImage }}
                style={{
                  aspectRatio: 1,
                  width: '100%',
                  flex: 1,
                }}
                PlaceholderContent={<ActivityIndicator />}
              />

              <Ionicons
                name="md-play"
                size={30}
                color={'#fff'}
                onPress={() => { handlePlaySong(postItem) }}
                style={{ position: "absolute", top: "15px", left: "15px" }}
              />

            </View>
            <View style={{ width: "calc(100% - 90px)", backgroundColor: MAIN_THEME_2, float: "left", display: "inline-block", height: "60px", position: "relative" }}>
              <p style={{ margin: "2px 0px 1px 0px", padding: "2px", fontSize: "9px", fontFamily: FONT_FAMILY, maxHeight: "18px", textOverflow: "elipsis", overflow: "hidden" }}>
                <b>{postItem.postType.toUpperCase()}: {postItem.postTitle}</b>
              </p>
              <p style={{ margin: "0px", padding: "2px", fontSize: "8px", fontFamily: FONT_FAMILY, maxHeight: "18px", textOverflow: "elipsis", overflow: "hidden" }}>Artists: {postItem.postArtist}</p>

              <p style={{ margin: "0px", padding: "0px", fontSize: "8px", position: "absolute", bottom: 3, left: 2, height: "16px", fontFamily: FONT_FAMILY, maxHeight: "10px", width: "calc(66% - 10px)", float: "left" }}>Posted by: Polyg_wat_it_is_mmk</p>
              <p style={{ margin: "0px", padding: "0px", fontSize: "8px", position: "absolute", bottom: 3, right: 2, height: "16px", fontFamily: FONT_FAMILY, maxHeight: "10px", width: "calc(33% - 10px)", float: "left" }}>Length: {postItem.postLength}</p>

            </View>
            <View style={{ width: "30px", backgroundColor: MAIN_THEME_3, float: "left", display: "inline-block", height: "60px", position: "relative" }}>

              <View style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                width: "30px"
              }} >
                <Ionicons
                  name="ellipsis-vertical"
                  size={20}
                  color={'#fff'}
                  onPress={() => { handleChangeOpen(postItem) }}
                // style={postItem["expanded"] ?  {transform: 'rotate(180deg)'} : {transform: 'rotate(0deg)'}}
                // style={{position: "absolute", top: "15px", left: "15px"}}
                />

              </View>

              <View style={{
                position: "absolute",
                bottom: "0px",
                left: "0px",
                width: "30px"
              }} >
                <Button radius={'sm'} type="clear">
                  <Ionicons
                    name="chevron-up-outline"
                    // size={30}
                    color={'#fff'}
                    onPress={() => { handleChangeExpand(postItem) }}
                    style={postItem["expanded"] ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' }}
                  // style={{position: "absolute", top: "15px", left: "15px"}}
                  />
                </Button>
              </View>

            </View>
          </View>
        )


      })}
      {/* <Text>USER FEED for {props.rcastUserInfo.email}</Text>
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
                /> */}
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <Text>Extra functionality</Text>
        <Text>
          Add to queue
        </Text>
        <Text>
          Add to spotify likes
        </Text>
        <Text>
          Add to Playlist
        </Text>
        {/* <Button
        icon={
          <Icon
            name="wrench"
            type="font-awesome"
            color="white"
            size={25}
            iconStyle={{ marginRight: 10 }}
          />
        }
        title="Start Building"
        onPress={toggleOverlay}
      /> */}
      </Overlay>
    </View>
  )
}