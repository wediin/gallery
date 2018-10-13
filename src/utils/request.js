import axios from 'axios'

const request = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 5000
})

export default request
