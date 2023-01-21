

import * as React from 'react';
import { Button, Overlay, Icon } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';

import { objectCopy } from "../utils/misc"
import { getInfoByType } from '../API/spotifyRequests.js/getInfoByType';

import { _storeData, _retrieveData } from "../utils/storage"


const postInfoTemplate = {
    postSourceId: "",
    postUserComment: "",
    postType: "",
    postImage: "",
    postTitle: "",
    postArtist: "",
    postLength: "",
}

export default function UserShares() {

    const [visible, setVisible] = React.useState(false);

    const [postInfo, setPostInfo] = React.useState(objectCopy(postInfoTemplate))

    const [newPostShareLink, setNewPostShareLink] = React.useState('')

    const [errorText, setErrorText] = React.useState('')

    const toggleOverlay = () => {
        setVisible(!visible);
    };


    const handleOpenNewPost = () => {
        toggleOverlay()
    }

    const handleUpdateComment = (newComment) => {
        var postInfoCopy = objectCopy(postInfo);
        postInfoCopy["postUserComment"] = newComment;
        setPostInfo(postInfoCopy)
    }

    const getImageOptions = (options) => {
        var image = "";
        var currentSize = null
        for (let m = 0; m < options.length; m++) {
            if (currentSize > options[m]["width"]) {
                image = options[m]["url"];
                currentSize = options[m]["width"]
            }
            else if(!currentSize){
                image = options[m]["url"];
                currentSize = options[m]["width"]
            }
            
        }
        return image
    }

    const handleUpdatePostLink = (value) => {
        setNewPostShareLink(value)
        console.log(value)
        if (value.includes("https://open.spotify.com/")) {
            var importantInfo = value.split("https://open.spotify.com/")[1].split("/")
            var type = importantInfo[0]
            var id = importantInfo[1]
            console.log(type)
            console.log(id)
            if (!["track", "album", "playlist", "artist"].includes(type)) {
                setErrorText("Type must be track, album, playlist, or artist")
                return
            }
            if (type.length > 0 && id.length > 0) {
                _retrieveData('accessToken').then(token => {
                    getInfoByType(type, id, token).then(res => {
                        console.log(res)
                        if (Object.keys(res).includes("id")) {
                            var newPostObject = objectCopy(postInfoTemplate)
                            newPostObject["postSourceId"] = id;
                            newPostObject["postType"] = type;
                            newPostObject["postType"] = type;

                            if (type === "track") {
                                if (Object.keys(res).includes("album")) {
                                    if (Object.keys(res["album"]).includes("images")) {
                                        var options = res["album"]["images"];
                                        newPostObject["postImage"] = getImageOptions(options)
                                        newPostObject["postTitle"] = res["name"]
                                        newPostObject["postArtist"] = res["artists"].map(obj => obj.name).join(", ")
                                        newPostObject["postLength"] = String(res["duration_ms"])
                                    }
                                }
                            }
                            else if (type === "album") {
                                if (Object.keys(res).includes("images")) {
                                    newPostObject["postImage"] = getImageOptions(res["images"])
                                    newPostObject["postTitle"] = res["name"]
                                    newPostObject["postArtist"] = res["artists"].map(obj => obj.name).join(", ")
                                    newPostObject["postLength"] = String(res["total_tracks"])
                                }
                            }
                            else if (type === "playlist") {
                                newPostObject["artist"] = res["owner"]["display_name"];
                                if (Object.keys(res).includes("images")) {
                                    newPostObject["postImage"] = getImageOptions(res["images"])
                                    newPostObject["postTitle"] = res["name"]
                                    newPostObject["postArtist"] = res["owner"]["display_name"]
                                    newPostObject["postLength"] = String(res["tracks"]["items"].length)

                                }
                            }
                            else if(type === "artist"){
                                if (Object.keys(res).includes("images")) {
                                    newPostObject["postImage"] = getImageOptions(res["images"])
                                    newPostObject["postTitle"] = res["name"]
                                    newPostObject["postArtist"] = res["name"]

                                }
                            }
                            console.log(newPostObject)
                            // {
                            //     postSourceId: "",
                            //     postUserComment: "",
                            //     postType: "",
                            //     postImage: "",
                            //     postTitle: "",
                            //     postArtist: "",
                            //     postLength: "",
                            // }

                        }
                        else {
                            setErrorText("Invalid share link")
                        }
                    })
                })
            }
        }
        else{
            setErrorText("Invalid share link")
        }
    }

    return (
        <>
            <View
            // style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
            >
                <Button
                    title="New Post"
                    onPress={() => {
                        handleOpenNewPost();
                    }}
                    type="outline"
                />
            </View>

            <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                <Text>New Post</Text>

                <Input
                    placeholder='BASIC INPUT'
                    value={newPostShareLink}
                    onChangeText={value => handleUpdatePostLink(value)}
                />
                <Input
                    placeholder="Comment"
                    leftIcon={{ type: 'font-awesome', name: 'comment' }}
                    onChangeText={value => handleUpdateComment(value)}
                    value={postInfo["postUserComment"]}
                />

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
        </>
    )
}