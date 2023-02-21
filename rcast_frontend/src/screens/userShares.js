

import * as React from 'react';
import { Button, Overlay, Icon } from '@rneui/themed';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';
import { Image } from '@rneui/themed';

import { objectCopy } from "../utils/misc"
import { getInfoByType } from '../API/spotifyRequests.js/getInfoByType';

import { _storeData, _retrieveData } from "../utils/storage"

import { MAIN_THEME_1, MAIN_THEME_2, MAIN_THEME_3, FONT_FAMILY} from '../utils/constants';
import { FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import newPost from '../API/posts/newPost';

const postInfoTemplate = {
    postSourceId: "",
    postUserComment: "",
    postType: "",
    postImage: "",
    postTitle: "",
    postArtist: "",
    postLength: "",
}

export default function UserShares(props) {

    const [visible, setVisible] = React.useState(false);

    const [postInfo, setPostInfo] = React.useState(objectCopy(postInfoTemplate))

    const [newPostShareLink, setNewPostShareLink] = React.useState('')

    const [errorText, setErrorText] = React.useState('')

    const [userPosts, setUserPosts] = React.useState([])

    const toggleOverlay = () => {
        setNewPostShareLink('')
        setVisible(!visible);
        setPostInfo(objectCopy(postInfoTemplate))
    };


    const handleOpenNewPost = () => {
        setPostInfo(objectCopy(postInfoTemplate))
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
            else if (!currentSize) {
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
            if (id.includes("?")) {
                id = id.split("?")[0]
            }
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
                            else if (type === "artist") {
                                if (Object.keys(res).includes("images")) {
                                    newPostObject["postImage"] = getImageOptions(res["images"])
                                    newPostObject["postTitle"] = res["name"]
                                    newPostObject["postArtist"] = res["name"]

                                }
                            }
                            console.log(newPostObject)
                            setPostInfo(newPostObject)
                        }
                        else {
                            setErrorText("Invalid share link")
                        }
                    })
                })
            }
        }
        else {
            setErrorText("Invalid share link")
        }
    }

    const handleSubmitPost = () => {
        // console.log(postInfo)
        _retrieveData("rcastToken").then(token => {
            newPost(postInfo, token).then(res => {
                console.log(res)
                if(Object.keys(res).includes("data")){
                    var userPostsCopy = objectCopy(userPosts)
                    var postCopy = objectCopy(postInfo)
                    postCopy["postId"] = res["data"]["postId"]
                    postCopy["postComments"] = []
                    userPostsCopy.unshift(postCopy)
                    setUserPosts(userPostsCopy)
                    toggleOverlay()
                }
            })

        })
    }

    // const confirmFriendRequest = (friendRequestId) => {
    //     console.log("okkkk")

    // }
    

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

            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{width: "100%", padding: "2px", paddingBottom: "5px"}}>
                <Text style={{backgroundColor: MAIN_THEME_3, width: "100%", fontFamily: FONT_FAMILY, padding: "5px", borderTopLeftRadius: "5px", borderTopRightRadius: "5px", marginBottom: "5px"}}>New Post</Text>

                <Input
                    placeholder='Spotify Share Link'
                    value={newPostShareLink}
                    onChangeText={value => handleUpdatePostLink(value)}
                    style={{width: "100%"}}
                    inputStyle={{fontSize: "12px", height: "20px", minHeight:"20px", paddingVertical: 0}}
                    containerStyle = {{ height: "20px",paddingHorizontal: 2, paddingVertical: 0}}
                    // containerStyle={{width: "100%", padding: "0px"}}
                />
                {postInfo.postTitle.length > 0 && 

                <>
                    <View style={{ width: "100%", display: "block", marginTop: "10px", marginBottom: "10px"}}>
                        <View style={{ width: "60px", backgroundColor: MAIN_THEME_1, float: "left", display: "inline-block", height: "60px", position: "relative"  }}>
                                <Image
                                  source={{ uri: postInfo.postImage }}
                                  style={{  
                                    aspectRatio: 1,
                                    width: '100%',
                                    flex: 1,
                                  }}
                                  PlaceholderContent={<ActivityIndicator />}
                                />
              
                                  {/* <Ionicons
                                    name="md-play"
                                    size={30}
                                    color={ '#fff'}
                                    onPress={() => {handlePlaySong(postInfo)}}
                                    style={{position: "absolute", top: "15px", left: "15px"}}
                                 />
               */}
                              </View>
                              <View style={{ width: "calc(100% - 60px)", backgroundColor: MAIN_THEME_2, float: "left", display: "inline-block",  height: "60px" , position: "relative"}}>
                                  <p style={{margin: "2px 0px 1px 0px", padding: "2px", fontSize: "9px", fontFamily: FONT_FAMILY, maxHeight: "18px", textOverflow: "elipsis", overflow: "hidden"}}>
                                    <b>{postInfo.postType.toUpperCase()}: {postInfo.postTitle}</b>
                                    </p>
                                  <p style={{margin: "0px", padding: "2px", fontSize: "8px", fontFamily: FONT_FAMILY,maxHeight: "18px", textOverflow: "elipsis", overflow: "hidden"}}>Artists: {postInfo.postArtist}</p>
              
                                  {/* <p style={{margin: "0px", padding: "0px", fontSize: "8px", position: "absolute", bottom: 3, left: 2, height: "16px", fontFamily: FONT_FAMILY, maxHeight: "10px", width: "calc(66% - 10px)", float: "left"}}>Posted by: Polyg_wat_it_is_mmk</p> */}
                                  <p style={{margin: "0px", padding: "0px", fontSize: "8px",  position: "absolute", bottom: 3, left: 2, height: "16px", fontFamily: FONT_FAMILY, maxHeight: "10px", width: "calc(33% - 10px)", float: "left"}}>Length: {postInfo.postLength}</p>
              
                              </View>
                              </View>
                
                


                <Input
                    placeholder="Comment"
                    // leftIcon={{ type: 'font-awesome', name: 'comment' }}
                    onChangeText={value => handleUpdateComment(value)}
                    value={postInfo["postUserComment"]}
                    // numberOfLines={2}
                    inputStyle={{fontSize: "12px", height: "20px", minHeight:"20px", paddingVertical: 0}}
                    containerStyle = {{ height: "20px",paddingHorizontal: 2, paddingVertical: 0}}
                />

               <View style={{width: "100%", marginTop: "20px", marginBottom: "10px"}}>

               <Button
                    title="Post"
                    onPress={() => {
                        handleSubmitPost();
                    }}
                    // buttonStyle={{margin: "20px 0px"}}
                    type="solid"
                />
               </View>

</>


                }

        </Overlay>
        </>
    )
}