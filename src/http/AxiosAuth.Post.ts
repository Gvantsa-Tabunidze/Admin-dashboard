import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL
const API_KEY =  import.meta.env.VITE_API_KEY

const $axios = axios.create({
    baseURL: API_URL,
    headers: {
    'Content-Type': 'application/json',
    'x-bypass-token': API_KEY,
  },
  
})

export default $axios

