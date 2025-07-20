import axios from "axios"


const LOCATION_URL = `https://maps.googleapis.com/maps/api/geocode/json`;

const axiosLocation = axios.create({
    baseURL: LOCATION_URL,
    timeout: 3000
})

export default axiosLocation

