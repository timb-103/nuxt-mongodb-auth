import { defineEventHandler, createError, readBody } from 'h3'
import { mongo } from '#nuxt-mongodb'

export default defineEventHandler(async (event) => {
  try {
    const db = mongo.db()
    const { sessionId } = await readBody(event)

    // remove the active session
    await db.collection('Sessions').deleteOne({ sessionId })

    return 'Logged out.'
  } catch (e) {
    console.log('Error logging out:', e)
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Error logging out.',
  })
})
