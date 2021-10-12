const AWS = require('aws-sdk')

let ssm

const GetParameters = async (parameterNames, region) => {
  if (!ssm) {
    ssm = new AWS.SSM({
      region: region,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    })
  }
  const params = {
    Names: parameterNames,
    WithDecryption: true,
  }
  try {
    const parameters = await ssm.getParameters(params).promise()
    return formatParameters(parameters)
  } catch (e) {
    return e
  }
}

const formatParameters = (parameters) => {
  return parameters.Parameters.reduce((object, param) => {
    return { ...object, [param.Name]: param.Value }
  }, {})
}

export default GetParameters
