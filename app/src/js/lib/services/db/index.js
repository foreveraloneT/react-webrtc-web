import low from 'lowdb'
import storage from 'lowdb/lib/storages/browser'

const db = low('db', { storage })

db.defaults({})
  .write()

export const setVariable = (name, value) => db.set(name, value).write()
export const clearVariable = name => db.unset(name).write()
export const getVariable = name => db.get(name).value()
