export default defineEventHandler(async (event) => {
  const user = requiresAuthSession(event)

  if (user) {
    return user
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Error getting auth user.',
  })
})
