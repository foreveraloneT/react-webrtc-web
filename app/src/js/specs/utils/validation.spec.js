import expect from 'expect'
import { assign, reduce, isObject, isArray } from 'lodash'
import * as utils from '../../lib/utils/validation'

describe('Utilities validation method', () => {

  it('should return "true" with valid email', () => {
    const email = '1234@dotography.com'
    expect(utils.isEmail(email)).toEqual(true);
  })

  it('should return "false" with invalid email', () => {
    const email = '1234'
    expect(utils.isEmail(email)).toEqual(false);
  })

})
