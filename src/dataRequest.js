import axios from 'axios'
import GetToken from './GetToken'

const client = axios.create({
  baseURL: 'https://nameapi.matiaslang.info/api/names',
})

const request = ({ ...options }) => {
  client.defaults.headers.common.Authorization = `Bearer ${GetToken()}`
  const onSuccess = (response) => response
  const onError = (error) => {
    return error
  }

  return client(options).then(onSuccess).catch(onError)
}

export default request
