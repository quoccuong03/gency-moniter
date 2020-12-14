
import queryString from 'query-string'


// json


// alert
const showAlert = ({ type, message }) => {


  return null
}

const checkMessage = (messages) => {
  if (typeof messages === 'string') {
    return [messages]
  }
  else if (!messages || (typeof messages === 'object' && !Array.isArray(messages))) {
    return ['Something went wrong']
  }
  return messages
}

export const showWarningAlert = (message) => {
  return null
}

export const showErrorAlert = (messages) => {
  const _messages = checkMessage(messages)

  return showAlert({
    type: 'error',
    message: _messages[0]
  })
}

export const showSuccessAlert = (messages) => {

  return null
}

export const showConfirmAlert = () => {
  return null
}

// language
export const getCurrentLang = () => {
  const langs = ['cn', 'kr']
  const lang = localStorage.getItem('lang')
  const defaultLang = 'cn'

  if (lang) {
    if (langs.includes(lang)) {
      return lang
    }
    else {
      return defaultLang
    }
  }
  else {
    localStorage.setItem('lang', defaultLang)
    return defaultLang
  }
}

// array
export const checkIndexOfArray = (array, value) => {
  if (Array.isArray(array)) {
    let check = array.indexOf(value)
    if (check > -1) {
      return true
    }
  }

  return false
}


// url
export const getMediaUrl = (endpoint, fileName, path) => {
  return `${endpoint}${path}/${fileName}`
}

const deleteObjectEmptyField = (obj = {}) => {
  const newObj = {};
  if (obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === "object") {
        newObj[key] = deleteObjectEmptyField(obj[key]); // recurse
      } else if (obj[key] != null) {
        newObj[key] = obj[key]; // copy value
      }
    });
  }


  return newObj;
};

export const getQueryString = (query = {}) => {

  const result = queryString.stringify(
    deleteObjectEmptyField(query)
  )

  if (!result) return ''
  return `?${result}`
}

export const encodeUri = (str) => {
  return str.replace(/\s+/g, '-')
}

export const decodeUri = (str) => {
  return str.replace(/-/g, ' ')
}

export const setPath = (lang, path, query) => {
  const queryString = getQueryString(query)
  const _lang = lang ? `/${lang}` : ''
  const _path = `${_lang}${path}${queryString}`

  return _path
}

export const debounced = (delay, fn) => {
  let timerId

  return (...args) => {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}


export const handleCheckRole = (arrayRule, rule) => {
  let check = arrayRule.filter(element => element.split(':')[0] === rule)

  if (check.length > 0) {
    return true
  }
  return false
}



export const number_to_price = (v) => {
  if (v === 0) { return '0'; }
  v = v.toString();

  v = v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  v = v.split('.').join('*').split(',').join('.').split('*').join(',');
  return v;
}

export const price_to_number = (v) => {
  if (!v) { return 0; }
  v = v.split('.').join('');
  v = v.split(',').join('.');

  return Number(v);
}