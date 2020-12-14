import axios from 'axios'

// import {
//   getQueryString,
// } from '../helpers/common'
// import {
//   message
// } from 'antd'
import constants from '../helpers/constants'

const ENDPOINT = constants.ENDPOINT
function send({ method = 'get', path, data = null, query = null, headers = {}, allowToken = true, newUrl }) {
  return new Promise(resolve => {
    // ${getQueryString(query)}
    let url = `${ENDPOINT}${path}`
    if (newUrl) {
      url = newUrl
    }

    axios({ method, url, data, headers })
      .then(result => {
        const data = result.data

        return resolve(data)
      })
      .catch(error => {
        const result = error.response

        if (!result) {
          // message.warn('Something went wrong!')
          return resolve({ status: 0 })
        }
        else {
          const { status, data } = result

          if (
            status === 401 && data === 'Unauthorized') {
            // message('Unauthorized')

          }
          else {
            return resolve(result.data)
          }
        }
      })
  })
}




function uploadFile({ method = 'post', path, file, body = {}, headers = {} }) {
  return new Promise(resolve => {
    const url = `${ENDPOINT}${path}`
    // const accessToken = getCookie('atoken')

    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'multipart/form-data'
    }

    // if (!headers['Authorization'] && accessToken) {
    //   headers['Authorization'] = `Bearer ${accessToken}`
    // }

    const form = new FormData()
    form.append('media_upload', file)
    const data = []
    axios({
      method,
      headers,
      url,
      data
    })
      .then(result => {
        const { data } = result

        return resolve(data)
      })

      .catch(error => {
        const result = error.response

        if (!result) {
          // message('Something went wrong!')
        }
        else {
          const { status, data } = result

          if (status === 401 && data === 'TokenExpired') {
            // message('Your session has expired, please login again')

          }
          else if (
            (status === 401 && data === 'Unauthorized') ||
            (status === 403 && data === 'InvalidToken')) {
            // message('Unauthorized')

          }
          else {
            return resolve(result.data)
          }
        }
      })
  })
}

export default {
  send,
  uploadFile
}