import { ViteSetupModule } from '~/config/types/ViteSetupModule'
import { createI18n } from 'vue-i18n'

export const priority = 2

export const install: ViteSetupModule = ({ app }) => {
  const messages = Object.fromEntries(
    Object.entries(import.meta.globEager('../../locales/*.{y(a)?ml,json}')).map(([key, value]) => {
      const isYamlOrJson = key.endsWith('.yaml') || key.endsWith('.json')
      return [key.slice(14, isYamlOrJson ? -5 : -4), value.default]
    })
  )

  const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages,
    globalInjection: true
  })

  app.use(i18n)
}
