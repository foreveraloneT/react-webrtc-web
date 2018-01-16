import { combineReducers } from 'redux'
import entities from './entities'
import error from './error'
import loading from './loading'

const rootReducer = combineReducers({
  entities,
  error,
  loading,
});

export default rootReducer
