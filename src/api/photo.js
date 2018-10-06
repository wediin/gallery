import request from '@/utils/request'

export default {
  getPhoto () {
    return request.get('/photo')
  }
}
