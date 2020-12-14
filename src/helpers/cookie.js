import Cookies from 'js-cookie'

export function setCookies(obj) {
  // for (let key in obj) {
  //   Cookies.set(key, obj[key], { expires: 30 })
  // }
}

export function getCookie(name) {
  return Cookies.get(name)
}

export function setCookie(name, value) {
  Cookies.set(name, value, { expires: 30 })
}
export function clearCookies() {

}

// export function clearCookies(...cookies) {
//   for (let cookie of cookies) {
//     Cookies.remove(cookie)
//   }
// }

export function removeCookie(name) {
  Cookies.remove(name)
}