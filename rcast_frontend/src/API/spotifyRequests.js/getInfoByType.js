// track / album / artist / playlist
// get info by type 
export const getInfoByType = async (type, id, token) => {
    const response = await fetch('https://api.spotify.com/v1/' + type + 's/' + id, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    });
    const responseJson = response.json();
    return responseJson
}
