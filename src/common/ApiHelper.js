import axios from 'axios'
import {baseUrl} from './constant.js'

export async function postData(endpoint, data){
  try {
    return await axios.post(baseUrl + endpoint, data)
  } catch (e) {
    throw e
  }
}

export async function patchData(endpoint, data){
  try {
    return await axios.patch(baseUrl + endpoint, data)
  } catch (e) {
    throw e
  }
}

export async function deleteData(endpoint, data){
  try {
    return await axios.delete(baseUrl + endpoint, data)
  } catch (e) {
    throw e
  }
}

export async function getData(endpoint, data){
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + (localStorage.getItem('token'))

  try {
    return await axios.get(baseUrl + endpoint)
  } catch (e) {
    throw e
  }
}