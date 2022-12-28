
import { View, Text } from 'react-native';
export default function UserFeed(props) {
  console.log(props)
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>USER FEED for {props.rcastUserInfo.spotify_id}</Text>
      </View>
    )
}