import ky from 'ky'

const json = await ky.get('https://nameapi.matiaslang.info')
export default json
