import { createHead } from '@vueuse/head'
import { ViteSetupModule } from '~/config/types/ViteSetupModule'

export const priority = 1

export const install: ViteSetupModule = ({ app }) => {
  const head = createHead()
  app.use(head)
}
