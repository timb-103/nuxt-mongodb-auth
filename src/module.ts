import {
  defineNuxtModule,
  createResolver,
  addImports,
  addPlugin,
  addServerHandler,
  addTemplate,
  installModule,
  addImportsDir,
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
      filename: 'nuxt-mongodb-auth.d.ts',
      getContents: () =>
        [
          "declare module '#nuxt-mongodb-auth' {",
          `  const requiresAuthSession: typeof import('${resolve(
            './runtime/server/utils'
          )}').requiresAuthSession`,
          `  const mongo: typeof import('${resolve('./runtime/server/utils')}').mongo`,
          '}',
        ].join('\n'),
    })

    // add auth composables
    addImportsDir(resolve('./runtime/composables'))

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
