import axios from "axios"

const cloud_name = 'dp6jtpytm'

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${cloud_name}/image`

const axiosUpload = axios.create({
    baseURL: UPLOAD_URL,


})

export default axiosUpload

