import axios from 'axios'
const request = axios.create({
  baseURL: config.baseUrl
})
const dic = {
  id: 'id',
  park: 'field01', // 停车场
  x: 'field02',
  y: 'field03',
  width: 'field04',
  height: 'field05',
  rotate: 'field06',
  type: 'field07',
  deviceID: 'field08'
}
function convertKeys (params) {
  return Object.fromEntries(Object.entries(params).map(([key, value]) => [dic[key], value]))
}
export const getList = (params) => {
  return request.post('/park/place', {
    action: 'queryInfo',
    pageNum: 1,
    pageSize: 2000
  }).then(res => {
    // 此接口不带筛选，数据不会很多，所以拿到数据以后前端做筛选
    if (res.data && res.data.data) {
      const data = res.data.data.filter(i => {
        return Object.keys(params).every(key => {
          return params[key] === i[dic[key]]
        })
      })
      return {
        data: data,
        total: data.length
      }
    } else {
      return Promise.reject(new Error('返回错误'))
    }
  })
}

export const addInfo = (params) => {
  return request.post('/park/place', {
    action: 'addInfo',
    ...convertKeys(params)
  })
}

export const updateInfo = (params) => {
  return request.post('/park/place', {
    action: 'updateInfo',
    ...convertKeys(params)
  })
}

export const deleteInfo = (params) => {
  return request.post('/park/place', {
    action: 'deleteInfo',
    id: params.id
  })
}

export const getStatus = () => {
  return request.post('/parking', {
    action: 'getParkStatus'
  })
}
