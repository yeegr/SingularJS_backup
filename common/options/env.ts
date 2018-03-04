interface IServers {
  [key: string]: {
    [key: string]: string
  }
}

export const ENV: IServers = {
  production: {
    CODE_PUSH: '1TpsGMwymIbkfmoaULfwHuftguwS4yxZxs7YZ',
    API_SERVER: 'http://shitulv.com/api/',
    WEB_SERVER: 'http://shitulv.com/',
    UPLOAD_SERVER: 'http://upload:3000/',
    STATIC_SERVER: 'http://shitulv.com/static/'
  },
  staging: {
    CODE_PUSH: 'FBLHx5jP2lMiFbjEcF48SnOvsOHc4yxZxs7YZ',
    API_SERVER: 'http://shitulv.com/api/',
    WEB_SERVER: 'http://shitulv.com/',
    UPLOAD_SERVER: 'http://upload:3000/',
    STATIC_SERVER: 'http://shitulv.com/static/'
  },
  development: {
    CODE_PUSH: 'FBLHx5jP2lMiFbjEcF48SnOvsOHc4yxZxs7YZ',
    API_SERVER: 'http://localhost:3000/',
    WEB_SERVER: 'http://localhost/',
    UPLOAD_SERVER: 'http://upload:3000/',
    STATIC_SERVER: 'http://static/'
  }
}
