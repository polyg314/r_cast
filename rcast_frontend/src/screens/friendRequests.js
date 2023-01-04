import * as React from 'react';
import { View } from "react-native";

// import { Icon } from '@rneui/themed';

// import Icon from 'react-native-vector-icons/FontAwesome';
import { _retrieveData } from "../utils/storage";

import {
    ListItem,
    Avatar
 } from '@rneui/themed';
//  import Icon from 'react-native-vector-icons/FontAwesome';

import updateFriendRequest from '../API/friends/updateFriendRequest';
import {objectCopy} from "../utils/misc"



export default function FriendRequests(props) {
    console.log("MUAH")
    console.log(props.yourFriendRequests)
    
    const confirmFriendRequest = (friendRequestId) => {
        console.log("okkkk")
        _retrieveData("rcastToken").then(token => {
            updateFriendRequest(friendRequestId, "ACCEPTED", token).then(res => {
                var yourFriendRequestsCopy = objectCopy(props.yourFriendRequests)
                var yourFriendRequestsCopyFiltered = yourFriendRequestsCopy.filter(obj => obj.friend_request_id !== friendRequestId)
                props.handleSetYourFriendRequests(yourFriendRequestsCopyFiltered)

                var friendsCopy = objectCopy(props.userFriends)
                console.log(friendsCopy)
                // friendsCopy.push({
                //     User: yourFriendRequestsCopy.filter(obj => obj.friendRequestId === friendRequestId)[0]["User"], 
                //     friendshipId: res.data
                // })
                props.handleSetUserFriends(friendsCopy)
                /// FIX  -- Also add to your friends
            })

        })
    }


    const denyFriendRequest = (friendRequestId) => {
        console.log("okkkk")
        _retrieveData("rcastToken").then(token => {
            updateFriendRequest(friendRequestId, "DENIED", token).then(res => {
                var yourFriendRequestsCopy = objectCopy(props.yourFriendRequests)
                var yourFriendRequestsCopyFiltered = yourFriendRequestsCopy.filter(obj => obj.friend_request_id !== friendRequestId)
                props.handleSetYourFriendRequests(yourFriendRequestsCopyFiltered)
            })
        })
    }


   return (
<View style={{ flex: 1 }}>

    {props.yourFriendRequests .map((request, i) => (
            <ListItem
               key={i}
               //  onPress={log} 
               bottomDivider
            >
               {/* <Avatar title={l.name} source={{ uri: l.avatar_url }} /> */}
               <ListItem.Content>
                  <ListItem.Title>{request.user.display_name}</ListItem.Title>
                  <ListItem.Subtitle>{request.user.email}</ListItem.Subtitle>
                  
               </ListItem.Content>

 
               <Avatar
                    size={32}
                    rounded
                    title="C"
                    onPress={() => confirmFriendRequest(request.friend_request_id)}
                    containerStyle={{ backgroundColor: '#3d4db7' }}
                />
                <Avatar
                    size={32}
                    title="X"
                    onPress={() => denyFriendRequest(request.friend_request_id)}
                    containerStyle={{ backgroundColor: '#000' }}
                />


            </ListItem>
         ))}
</View>
   );
 }