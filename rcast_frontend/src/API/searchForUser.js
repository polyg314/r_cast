import axios from "axios"
import { axiosConfig, API_ENDPOINT } from "../utils/constants";
import { _retrieveData } from "../utils/storage";

async function searchForUser(searchString, token){
    axiosConfig["Authorization"] = token
    try {
        let res = await axios({
             url: API_ENDPOINT + '/search-for-user/' + searchString,
             method: 'get',
             timeout: 8000,
             headers: axiosConfig
         })
         if(res.status === 200){

             return res
         }    
         return null
     }
     catch (err) {
         console.error('There was an error!', err);
         return null
     }
}

export default searchForUser;