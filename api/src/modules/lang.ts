import * as i18next from 'i18next'

const zh = require('../../../common/locales/zh/base.json')

i18next.init({
  lng: 'zh',
  fallbackLng: 'en',
  resources: {
    zh: {
      translation: zh
    }
  },
  debug: true
})

export { i18next }
