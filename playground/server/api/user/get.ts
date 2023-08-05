import { requiresAuthSession } from '#nuxt-mongodb-auth'
import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  console.log('hello!')
  const user = await requiresAuthSession(event)

  console.log('user:', user)

  if (user) {
    return user
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Error getting auth user.',
  })
})
