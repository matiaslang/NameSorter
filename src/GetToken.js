import { getParameters } from './getParameters'
import axios from 'axios'

const aws = require('aws-sdk')

const parameterNames = [
  '/amplify/d1w9s5avni0ilk/default/audience',
  '/amplify/d1w9s5avni0ilk/default/client_id',
  '/amplify/d1w9s5avni0ilk/default/client_secret',
]

const getParams = async () => {
  var parameters = await getParameters(parameterNames, 'eu-north-1')
  console.log('PARAMETERS FOUND2')
  console.log(parameters['/amplify/d1w9s5avni0ilk/default/audience'])
  return parameters
}

const GetToken = async () => {
  const params = await getParams()
  console.log(params)
  const clientId = params['/amplify/d1w9s5avni0ilk/default/client_id']
  const clientSecret = params['/amplify/d1w9s5avni0ilk/default/client_secret']
  const audience = params['/amplify/d1w9s5avni0ilk/default/audience']
  console.log('PARMETERS HERE:')
  console.log(clientId)
  console.log(clientSecret)
  console.log(audience)

  var postData = {
    grant_type: 'client_credentials',
    client_id: { clientId },
    client_secret: { clientSecret },
    audience: { audience },
  }
  var axiosConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }

  await axios
    .post(
      'https://dev-wuhb2z2r.us.auth0.com/oauth/token',
      postData,
      axiosConfig
    )
    .then((res) => {
      console.log('RESPONSE IS FOLLOWING:', res)
    })
    .catch((err) => {
      console.log('AXIOS ERROR: ', err)
    })
  return 'token'
}

export default GetToken
