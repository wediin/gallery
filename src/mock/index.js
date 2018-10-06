import Mock from 'mockjs'
import photoAPI from './photo'

Mock.mock(/\/photo/, 'get', photoAPI.getPhoto)

export default Mock
