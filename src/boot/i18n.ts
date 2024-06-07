import { createI18n } from 'vue-i18n'
import messages from 'src/i18n'
import { App } from 'vue'

type TLang = 'en-US' | 'ru'
type MessageSchema = typeof messages[keyof typeof messages]

export default ({ app }: { app: App}) => {
  // Create I18n instance
  const i18n = createI18n<[MessageSchema], TLang>({
    locale: localStorage.getItem('userLocale') || 'en-US',
    legacy: false, // comment this out if not using Composition API
    messages
  })

  // Tell app to use the I18n instance
  app.use(i18n)
}
