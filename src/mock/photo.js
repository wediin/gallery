import Mock from 'mockjs'

let photo = []
const count = 50

for (let index = 0; index < count; index++) {
  photo.push(
    Mock.mock({
      contributor: '@name',
      createtimestamp: '@date',
      id: '@id',
      masked: '@boolean',
      'urls|1': [
        '@url(http)'
      ]
    })
  )
}

export default {
  getPhoto () {
    return photo
  }
}
