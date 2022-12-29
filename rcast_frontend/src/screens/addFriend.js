import * as React from 'react';
import { View, Text } from "react-native";
import { Input, Icon } from '@rneui/themed';

import { useIsFocused } from '@react-navigation/native';

import searchForUser  from "../API/searchForUser"

import { _retrieveData } from "../utils/storage";



export default function AddFriend() {

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
                setSearchFriends(res.data)
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
   </View>
   );
 }