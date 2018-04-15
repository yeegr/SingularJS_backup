/** 
 * Server endpoints
*/
interface IServers {
  [key: string]: {
    [key: string]: string
  }
}

export const ENV: IServers = {
  production: {
    CODE_PUSH: '1TpsGMwymIbkfmoaULfwHuftguwS4yxZxs7YZ',
    API_SERVER: 'http://api.singularjs.com/',
    UPLOAD_SERVER: 'http://upload.singularjs.com/',
    STATIC_SERVER: 'http://static.singularjs.com/',
    PLATFORM_SERVER: 'http://platform.singularjs.com/'
  },
  staging: {
    CODE_PUSH: 'FBLHx5jP2lMiFbjEcF48SnOvsOHc4yxZxs7YZ',
    API_SERVER: 'http://lab.singularjs.com/api/',
    UPLOAD_SERVER: 'http://lab.singularjs.com/upload/',
    STATIC_SERVER: 'http://lab.singularjs.com/static/',
    PLATFORM_SERVER: 'http://lab.singularjs.com/platform/'
  },
  development: {
    CODE_PUSH: 'FBLHx5jP2lMiFbjEcF48SnOvsOHc4yxZxs7YZ',
    API_SERVER: 'http://localhost:3000/api/v1/',
    UPLOAD_SERVER: 'http://localhost:3001/',
    STATIC_SERVER: 'http://static/',
    CONSUMER_SERVER: 'http://localhost:8080/',
    SUPPLIER_SERVER: 'http://localhost:8081/',
    PLATFORM_SERVER: 'http://localhost:8082/'
  }
}