import * as i18next from 'i18next'
import * as moment from 'moment-timezone'

import { default as zh } from '../../../common/locales/zh'
import { default as en } from '../../../common/locales/en'

i18next
.init({
  lng: 'zh',
  fallbackLng: 'en',
  ns: ['base', 'api'],
  defaultNS: 'api',
  resources: {
    zh,
    en
  }
})
.on('languageChanged', (lng) => {
  moment.locale(lng)
})

export { i18next }
