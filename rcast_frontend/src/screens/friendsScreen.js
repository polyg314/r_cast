import * as React from 'react';
// import { View } from "react-native";

// import { Icon } from '@rneui/themed';

// import Icon from 'react-native-vector-icons/FontAwesome';
import { _retrieveData } from "../utils/storage";

import {
   ListItem,
   Avatar
} from '@rneui/themed';

import { Button, Overlay, Icon } from '@rneui/themed'
//  import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet } from 'react-native';


import removeFriendship from '../API/friends/removeFriendship';
import { objectCopy } from "../utils/misc"


export default function FriendsScreen(props) {


   const [visible, setVisible] = React.useState(false);

   const toggleOverlay = () => {
      setVisible(!visible);
   };

   const [removeFriendshipObject, setRemoveFriendshipObject] = React.useState({})



   const confirmRemoveFriend = (friendship) => {
      setRemoveFriendshipObject(friendship)
      toggleOverlay()
   }


   const confirmRemoveFriendFinal = () => {
      var friendshipCopy = objectCopy(removeFriendshipObject)
      console.log(removeFriendshipObject)
      _retrieveData("rcastToken").then(token => {
         removeFriendship(friendshipCopy["friendship_id"], token).then(res => {
            if(res.success){
               var userFriendsCopy = objectCopy(props.userFriends)
               userFriendsCopy = userFriendsCopy.filter(obj => obj.friendship_id !== friendshipCopy["friendship_id"])
               props.handleSetUserFriends(userFriendsCopy)
               toggleOverlay()
               setRemoveFriendshipObject({})
            }
         })
      })
      toggleOverlay()
   }


   return (
      <>


         <View style={{ flex: 1 }}>

            {props.userFriends.map((friend, i) => (
               <ListItem
                  key={i}
                  //  onPress={log} 
                  bottomDivider
               >
                  {/* <Avatar title={l.name} source={{ uri: l.avatar_url }} /> */}
                  <ListItem.Content>
                     <ListItem.Title>{friend.user.display_name}</ListItem.Title>
                     <ListItem.Subtitle>{friend.user.email}</ListItem.Subtitle>

                  </ListItem.Content>


                  <Avatar
                     size={32}
                     rounded
                     title="D"
                     onPress={() => confirmRemoveFriend(friend)}
                     containerStyle={{ backgroundColor: '#3d4db7' }}
                  />
                  {/* <Avatar
                size={32}
                title="X"
               //  onPress={() => denyFriendRequest(request.friend_request_id)}
                containerStyle={{ backgroundColor: '#000' }}
            /> */}


               </ListItem>
            ))}



         </View>


         <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
            <Text>Remove friend {Object.keys(removeFriendshipObject).includes("user") && 
            <>
            {removeFriendshipObject.user.display_name}
            </>

            }?</Text>

            <Button
               // icon={
               //    <Icon
               //       name="wrench"
               //       type="font-awesome"
               //       color="white"
               //       size={25}
               //       iconStyle={{ marginRight: 10 }}
               //    />
               // }
               title="Cancel"
               onPress={() => toggleOverlay()}
            />
                        <Button
               // icon={
               //    <Icon
               //       name="wrench"
               //       type="font-awesome"
               //       color="white"
               //       size={25}
               //       iconStyle={{ marginRight: 10 }}
               //    />
               // }
               title="Confirm"
               onPress={() => confirmRemoveFriendFinal()}
            />
         </Overlay>

      </>
   );
}