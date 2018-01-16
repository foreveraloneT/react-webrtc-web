const API_PROD_URL = 'http://production.api.url/'
const API_DEV_URL = 'http://localhost:8081/'

let currentUrl = API_DEV_URL
let currentEnv = 'development'

if (process.env.NODE_ENV === 'production') {
  currentUrl = API_PROD_URL
  currentEnv = 'production'
}

export const API_ROOT = currentUrl;
export const ENVIRONMENT = currentEnv;
