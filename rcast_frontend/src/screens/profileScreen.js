import * as React from 'react';
import { View, Text } from "react-native";
import { Button } from '@rneui/themed';


export default function ProfileScreen(props) {
   return (
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
<Text style={{fontSize:16,fontWeight:'700'}}>profileScreen</Text>
                <Button
                title="Log out"
                onPress={() => {
                    props.logOutUser();
                }}
                type="outline"
                />
</View>
   );
 }