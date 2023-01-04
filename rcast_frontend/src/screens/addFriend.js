import * as React from 'react';
import { View } from "react-native";
import { Input } from '@rneui/themed';

import { useIsFocused } from '@react-navigation/native';

import searchForUser from "../API/searchForUser"
import newFriendRequest from "../API/friends/newFriendRequest"
import getAllFriendsRequested from "../API/friends/getAllFriendsRequested"
import {objectCopy} from "../utils/misc"

import { _retrieveData } from "../utils/storage";

import {
   Text,
   ListItem,
   Avatar,
   Icon,
   Badge,
   ListItemProps,
   Button,
   Switch,
   lightColors
} from '@rneui/themed';

export default function AddFriend(props) {

   const isFocused = useIsFocused()

   const [searchString, setSearchString] = React.useState('')
   const [searchFriends, setSearchFriends] = React.useState([])
   const [yourFriendsRequested, setYourFriendsRequested] = React.useState([])


   const handleUpdateFriendSearch = (ss) => {
      console.log(ss)
      setSearchString(ss)
      if (ss.length > 2) {
         // setSearchFriends([])
         _retrieveData("rcastToken").then(token => {
            searchForUser(ss, token).then(res => {
               console.log("SEACH FRIENDS")
               console.log(res)
               setSearchFriends(res.data.filter(obj => obj.id !== props.rcastUserInfo.id))
            })
         })



      } else {
         setSearchFriends([])
      }

   }

   React.useEffect(() => {
      console.log("rennnn")
      setSearchString('')
      _retrieveData("rcastToken").then(token => {
         getAllFriendsRequested(token).then(res=> {
            setYourFriendsRequested(res.data)
         })

      })

   }, [isFocused])


   const handleAddFriend = (friendUserId, displayName, email) => {
      console.log("ADDD F")
      console.log(friendUserId)
      console.log(displayName)
      console.log(email)
      _retrieveData("rcastToken").then(token => {
         newFriendRequest(friendUserId, token).then(res => {
            if(res.success){
              var friendRequestsCopy = objectCopy(yourFriendsRequested)
              friendRequestsCopy.push({user: {display_name: displayName, id: friendUserId, email: email}})
              setYourFriendsRequested(friendRequestsCopy)
            }
        })
      })

  }


  const getFriendSearchSecondary = (person) => {
   var friends = false
   var requestedAlready = false
   console.log("RESsss")
   console.log(yourFriendsRequested)
   console.log("USER FRIENDs")
   console.log(props.userFriends)
   if(props.userFriends.filter(obj => obj.user.id === person.id).length > 0){
       friends = true
   }
   if(yourFriendsRequested.filter(obj => obj.user.id === person.id).length > 0){
       requestedAlready = true
   }
   if(friends){
       return(
         <Button
         title="Already Friends"
          disabled={true}
         //  icon={{ name: 'delete', color: 'white' }}
         buttonStyle={{}}
      />
       )
   }
   else if(requestedAlready){
       console.log("REQ ALREADY")
       return(

           <Button
           title="Request sent"
            disabled={true}
           //  icon={{ name: 'delete', color: 'white' }}
           buttonStyle={{}}
        />
       )
   }
   else{
       return(
         <Button
            title="Add"
            onPress={() => handleAddFriend(person.id, person.display_name, person.email)}
            //  icon={{ name: 'delete', color: 'white' }}
            buttonStyle={{}}
         />

       )
   }
}


   return (
      <View style={{ flex: 1 }}>
         <Input

            placeholder="Friend Search"
            value={searchString}
            // leftIcon={{ type: 'font-awesome', name: 'comment' }}
            onChangeText={value => handleUpdateFriendSearch(value)}
         />


         {searchFriends.map((person, i) => (
            <ListItem
               key={i}
               //  onPress={log} 
               bottomDivider
            >
               {/* <Avatar title={l.name} source={{ uri: l.avatar_url }} /> */}
               <ListItem.Content>
                  <ListItem.Title>{person.display_name}</ListItem.Title>
                  <ListItem.Subtitle>{person.email}</ListItem.Subtitle>
               </ListItem.Content>
               {getFriendSearchSecondary(person)}
               {/* <ListItem.Chevron /> */}
            </ListItem>
         ))}
      </View>
   );
}