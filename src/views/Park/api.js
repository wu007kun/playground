import { parkData } from './mockResponse.js'
export const getList = (params) => {
  return new Promise((resolve, reject) => {
    const data = parkData.filter(i => {
      return Object.keys(params).every(key => {
        return params[key] === i[key]
      })
    })
    resolve(data)
  })
}

export const addInfo = (params) => {
  return Promise.resolve()
}

export const updateInfo = (params) => {
  return Promise.resolve()
}

export const deleteInfo = (params) => {
  return Promise.resolve()
}

export const getStatus = () => {
  return Promise.resolve()
}
