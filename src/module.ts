import {
  defineNuxtModule,
  createResolver,
  addImports,
  addPlugin,
  addServerHandler,
  addTemplate,
  installModule,
} from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-mongodb-auth',
    configKey: 'nuxtMongodbAuth',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // add options to runtime config
    // nuxt.options.runtimeConfig.nuxtMongodbAuth = defu(
    //   nuxt.options.runtimeConfig.nuxtMongodbAuth,
    //   options
    // )

    // add nuxt-mongodb module
    await installModule('nuxt-mongodb')

    // create virtual imports for server-side
    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(
        typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {},
        {
          inline: [resolve('./runtime')],
        }
      )
      nitroConfig.alias['#nuxt-mongodb-auth'] = resolve('./runtime/server/utils')
    })

    // add exports so we can use import {} from '#mongodb'
    addTemplate({
      filename: 'types/nuxt-mongodb-auth.d.ts',
      getContents: () =>
        [
          "declare module '#nuxt-mongodb-auth' {",
          `  const mongo: typeof import('${resolve(
            './runtime/server/utils'
          )}').requiresAuthSession`,
          '}',
        ].join('\n'),
    })

    // add auth composables
    addImports({
      name: 'useAuthLogin',
      as: 'useAuthLogin',
      from: resolve('./runtime/composables/login'),
    })
    addImports({
      name: 'useAuthRegister',
      as: 'useAuthRegister',
      from: resolve('./runtime/composables/register'),
    })
    addImports({
      name: 'useAuthLogout',
      as: 'useAuthLogout',
      from: resolve('./runtime/composables/logout'),
    })

    // add auth middleware
    addPlugin(resolve('./runtime/middleware-plugin'))

    // add api endpoints
    addServerHandler({
      route: '/api/mongodb-auth/login',
      handler: resolve('./runtime/server/api/login'),
    })
    addServerHandler({
      route: '/api/mongodb-auth/register',
      handler: resolve('./runtime/server/api/register'),
    })
    addServerHandler({
      route: '/api/mongodb-auth/logout',
      handler: resolve('./runtime/server/api/logout'),
    })
    addServerHandler({
      route: '/api/mongodb-auth/user',
      handler: resolve('./runtime/server/api/user'),
    })

    /// add the auth middleware
    addServerHandler({
      handler: resolve('./runtime/server/middleware/auth'),
    })
  },
})
