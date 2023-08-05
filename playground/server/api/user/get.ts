import { requiresAuthSession } from '#nuxt-mongodb-auth'
import { defineEventHandler, createError } from 'h3'
import { mongo } from '#nuxt-mongodb-auth'

export default defineEventHandler(async (event) => {
  const user = await requiresAuthSession(event)

  if (user) {
    return user
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Error getting auth user.',
  })
})
