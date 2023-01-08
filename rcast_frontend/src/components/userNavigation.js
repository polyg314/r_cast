
import * as React from 'react';

import {  View, StyleSheet, TouchableOpacity } from 'react-native';

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
import FriendsScreen from '../screens/friendsScreen';

import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import FriendRequests from '../screens/friendRequests';

import getAllFriendRequests from '../API/friends/getAllFriendRequests';
import getAllFriends from '../API/friends/getAllFriends';

import { _retrieveData } from "../utils/storage";

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

const BottomTabNavigator = (props) => {
    console.log("B PROPS")
    console.log(props)
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
        // component={() => <UserFeed rcastUserInfo={props.rcastUserInfo}/>}
      >
              {() => <UserFeed 
              rcastUserInfo={props.rcastUserInfo} 
              />}
      </Tab.Screen>
      <Tab.Screen name="Shares" component={UserShares} />
    </Tab.Navigator>
  );
};


const Drawer = createDrawerNavigator();



const DrawerNavigator = (props) => {
  console.log("DRAW props")
  console.log(props)
    return (
      <Drawer.Navigator initialRouteName="RCast">
        <Drawer.Screen name="RCast"
        // component={() => <BottomTabNavigator rcastUserInfo={props.rcastUserInfo}/>}
        >
          {() => <BottomTabNavigator rcastUserInfo={props.rcastUserInfo} />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile" 
        >
          {() => <ProfileScreen logOutUser={props.logOutUser}/>}
        </Drawer.Screen>
        <Drawer.Screen name="Friends">
        {() => 
            <FriendsScreen
                yourFriendRequests={props.yourFriendRequests}
                handleSetYourFriendRequests={props.handleSetYourFriendRequests}
                userFriends={props.userFriends}
                handleSetUserFriends={props.handleSetUserFriends}
            ></FriendsScreen>
        }
        </Drawer.Screen>
        <Drawer.Screen name="Friend Requests"
               options={{
                title: 'Friend Requests',
                drawerIcon: ({focused, size}) => (
<>
                   <Ionicons
                      name="md-home"
                      size={size}
                      color={focused ? '#7cc' : '#ccc'}
                   />
                   {props.yourFriendRequests.length > 0 && 
                                   <Badge
                                   status="error"
                                   value={props.yourFriendRequests.length}
                                   containerStyle={{ position: 'absolute', top: 12, right: 25 }}
                                 />
                   }

                </>
                ),
             }}
        >
          {() => 
          <FriendRequests
            yourFriendRequests={props.yourFriendRequests}
            handleSetYourFriendRequests={props.handleSetYourFriendRequests}
            userFriends={props.userFriends}
            handleSetUserFriends={props.handleSetUserFriends}
            />
          }
        </Drawer.Screen>
        <Drawer.Screen name="Add Friend">
          {() => <AddFriend 
          rcastUserInfo={props.rcastUserInfo}
          yourFriendRequests={props.yourFriendRequests}
          handleSetYourFriendRequests={props.handleSetYourFriendRequests}
          userFriends={props.userFriends}
          handleSetUserFriends={props.handleSetUserFriends}
          />}
        </Drawer.Screen>
      </Drawer.Navigator>
    );
  }



export default function UserNavigation(props) {


  const [userFriends, setUserFriends] = React.useState([])
  const [yourFriendRequests, setYourFriendRequests] = React.useState([])

  const handleSetUserFriends = (v) => {
    setUserFriends(v)
  }
  const handleSetYourFriendRequests = (v) => {
    setYourFriendRequests(v)
  }
  
  React.useEffect(() => {
    console.log("WHYYY")
    _retrieveData("rcastToken").then(token => {
      getAllFriendRequests(token).then(res=> {

        setYourFriendRequests(res.data)
      })
      getAllFriends(token).then((res) => {
        console.log("USSEERRR")
        console.log(res.data)
        setUserFriends(res.data)
      })
    })

  }, [])


    return (

        <>
          <DrawerNavigator 
            logOutUser={props.logOutUser}
            rcastUserInfo={props.rcastUserInfo}
            yourFriendRequests={yourFriendRequests}
            handleSetYourFriendRequests={handleSetYourFriendRequests}
            userFriends={userFriends}
            handleSetUserFriends={handleSetUserFriends}
          />
        </>





    );
}


