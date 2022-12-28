import axios from "axios"
import { axiosConfig, API_ENDPOINT } from "../utils/constants";

async function getRcastUserInfo(spotifyUserInfo){

    // spotify_id: req.body.id,
    // display_name: req.body.display_name,
    // email: req.body.email,

    var sendObj = {
        spotify_id: spotifyUserInfo.id,
        display_name: spotifyUserInfo.display_name,
        email: spotifyUserInfo.email,
    }

    try {
        let res = await axios({
             url: API_ENDPOINT + '/read/user',
             method: 'post',
             timeout: 8000,
             headers: axiosConfig,
             data: sendObj
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

export default getRcastUserInfo;