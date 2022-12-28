
import * as React from 'react';

import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';



import { createDrawerNavigator } from '@react-navigation/drawer';

import { DrawerItems } from "../utils/drawerItems"

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import UserFeed from "../screens/userFeed"
import UserShares from "../screens/userShares"
import ProfileScreen from '../screens/profileScreen';
import AddFriend from '../screens/addFriend';
import FriendScreen from '../screens/friendsScreen';

import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'


const Stack = createStackNavigator();
// https://dev.to/easybuoy/combining-stack-tab-drawer-navigations-in-react-native-with-react-navigation-5-da
  

// const MainStackNavigator = () => {
//     return (
//       <Stack.Navigator
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: "#9AC4F8",
//         },
//         headerTintColor: "white",
//         headerBackTitle: "Back",
//       }}   
//        >
//         <Stack.Screen name="Home" component={UserFeed} />
//         <Stack.Screen name="About" component={UserShares} />
//       </Stack.Navigator>
//     );
//   }
  
//   const ContactStackNavigator = () => {
//     return (
//       <Stack.Navigator screenOptions={screenOptionStyle}>
//         <Stack.Screen name="Contact" component={Contact} />
//       </Stack.Navigator>
//     );
//   }

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator 
        screenOptions={({ route }) => ({ 
            headerShown: false ,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Feed') {
                  iconName = focused
                    ? 'ios-information-circle'
                    : 'ios-information-circle-outline';
                } else if (route.name === 'Shares') {
                  iconName = focused ? 'ios-list' : 'ios-list-outline';
                }
    
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
        })}>
      <Tab.Screen 
        name="Feed" 
        component={UserFeed} 

      />
      <Tab.Screen name="Shares" component={UserShares} />
    </Tab.Navigator>
  );
};


const Drawer = createDrawerNavigator();



const DrawerNavigator = () => {
    return (
      <Drawer.Navigator initialRouteName="RCast">
        <Drawer.Screen name="RCast" component={BottomTabNavigator} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Friends" component={FriendScreen} />
        <Drawer.Screen name="Add Friend" component={AddFriend} />
      </Drawer.Navigator>
    );
  }



export default function UserNavigation() {


    return (

        <>
        <DrawerNavigator />
        </>





    );
}

