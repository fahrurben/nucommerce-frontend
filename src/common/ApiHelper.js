import axios from 'axios'
import {baseUrl} from './constant.js'

export async function postData(endpoint, data){
  try {
    return await axios.post(baseUrl + endpoint, data)
  } catch (e) {
    throw e
  }
}