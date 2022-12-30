import * as React from 'react';
import { View } from "react-native";
import { Input } from '@rneui/themed';

import { useIsFocused } from '@react-navigation/native';

import searchForUser  from "../API/searchForUser"

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


   const handleUpdateFriendSearch = (ss) => {
      console.log(ss)
      setSearchString(ss)
      if(ss.length > 2){
         // setSearchFriends([])
         _retrieveData("rcastToken").then(token => {
            searchForUser(ss, token).then(res => {
               console.log("SEACH FRIENDS")
               console.log(res)
                setSearchFriends(res.data.filter(obj => obj.id !== props.rcastUserInfo.id))
            })
         })



     }else{
         setSearchFriends([])
     }

   }

   React.useEffect(() => {
      console.log("rennnn")
      setSearchString('')
   }, [isFocused])


   return (
   <View style={{ flex: 1 }}>
   <Input

         placeholder="Friend Search"
         value={searchString}
         // leftIcon={{ type: 'font-awesome', name: 'comment' }}
         onChangeText={value => handleUpdateFriendSearch(value)}   
   />


   {searchFriends.map((person,i) => (
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
      <Button
          title="Add"
         //  icon={{ name: 'delete', color: 'white' }}
          buttonStyle={{  }}
        />
      {/* <ListItem.Chevron /> */}
      </ListItem>
   ))}
   </View>
   );
 }