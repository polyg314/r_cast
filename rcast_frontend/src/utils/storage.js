import AsyncStorage from '@react-native-async-storage/async-storage';

export const _storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
        console.log("Setttting")
        console.log(key)
        return "success"
      } catch (e) {
        // saving error
        console.log(e)
      }
  };

export const _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        // console.log("GET")
        // console.log(value);
        return value
      }
    } catch (error) {
      // Error retrieving data
    }
};
