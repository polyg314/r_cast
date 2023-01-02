
import axios from "axios"
import { axiosConfig, API_ENDPOINT } from "../../utils/constants";

async function getAllFriendRequests(token){
    axiosConfig["Authorization"] = token
    try {
        let res = await axios({
             url: API_ENDPOINT + '/get-all-friend-requests',
             method: 'get',
             timeout: 8000,
             headers: axiosConfig
         })
         if(res.status === 200){
             return res.data
         }    
         return null
     }
     catch (err) {
         console.error('There was an error!', err);
         return null
     }
}

export default getAllFriendRequests;