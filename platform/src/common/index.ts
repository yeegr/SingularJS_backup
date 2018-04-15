export * from '../../../common'

import * as i18next from 'i18next'
import * as moment from 'moment-timezone'

import { default as zh } from '../../../common/locales/zh'
import { default as en } from '../../../common/locales/en'

i18next
.init({
  lng: 'zh',
  fallbackLng: 'en',
  ns: ['base', 'platform'],
  defaultNS: 'platform',
  resources: {
    zh,
    en
  }
})
.on('languageChanged', (lng) => {
  moment.locale(lng)
})

export { i18next as LANG }

export function localizeError(code: string): {code: string; message: string} {
  return {
    code,
    message: i18next.t('base:error.' + code)
  }
}