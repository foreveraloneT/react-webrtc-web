import { get, find, isArray } from 'lodash'
import { getVariable, setVariable, clearVariable } from '../db'
import api from '../api'

/* Auth */

const setToken = (value) => {
  clearVariable('token')
  setVariable('token', value)
}

const getToken = () => {
  return getVariable('token')
}

const promiseHandleError = (error) => {
  let err = (error instanceof Error) ? error.message : error;
  return Promise.reject([err])
}

const login = (email, password) => {
  return api.post('user/login', { email, password })
    .then((data) => {
      let status
      let message = ''

      if (data.error || data.errors) {
        message = data.errors ? data.errors : ['Please enter email and password.']
        return Promise.reject(message)
      }

      status = true
      message = 'Successful'
      return { status, message, data }
    }, promiseHandleError)
}

const logout = (cb) => {
  Permission.destroy()
  clearVariable('token')
  if (cb) cb()
}

export const Auth = {
  setToken: value => setToken(value),
  getToken: () => getToken(),

  isLoggedIn: () => !!getToken(),
  login: (email, password) => login(email, password),
  logout: cb => logout(cb)
}

/* Permission */

const getPermission = () => {
  const permission = getVariable('permissions')
  return get(permission, 'value')
}

const setPermission = (value) => {
  clearVariable('permissions')
  setVariable('permissions', value)
}

const loadPermission = (token) => {
  return api.get('user/permissions', null, { Authorization: token })
    .then((data) => {
      if (data.errors) {
        return Promise.reject(data.errors)
      }
      return data.data
    }, promiseHandleError)
}

export const Permission = {
  access: (action) => {
    const currentPermission = find(getPermission(), p => p.permission.name == action || (isArray(action) && action.indexOf(p.permission.name) != -1) || p.permission.name == 'admin')
    return currentPermission != undefined
  },
  get: () => getPermission(),
  set: value => setPermission(value),
  load: token => loadPermission(token),
  destroy: () => clearVariable('permissions')
}
