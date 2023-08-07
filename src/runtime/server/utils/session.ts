import { H3Event, createError, setCookie } from 'h3'
import type { User } from '../../../user'

// @ts-ignore TODO: fix nuxt-mongodb exports?
import { mongo } from '#nuxt-mongodb'

export async function createSession(event: H3Event, userId: string) {
  try {
    const db = mongo.db()
    const sessionId = generateSessionId()
    const expires = new Date(new Date().getTime() + 60 * 24 * 60 * 60 * 1000) // 60 days

    // insert session into database
    await db.collection('Sessions').insertOne({ sessionId, userId, expires })

    // add sessionId into a cookie
    setCookie(event, 'sessionId', sessionId, { expires, secure: true })

    return sessionId
  } catch (e) {
    console.log('Error creating session:', e)
  }

  return ''
}

/**
 * Search our session store for an active session using the request authUser data.
 * If found, return the session otherwise return false
 */

export async function getSessionUser(sessionId: string = ''): Promise<User | null> {
  try {
    const db = mongo.db()

    // return if no sessionId
    if (!sessionId) {
      return null
    }

    // find the active session
    const session = await db.collection('Sessions').findOne({
      sessionId,
      expires: {
        $gte: new Date(),
      },
    })

    // get the user from the userId stored in the session and return it
    const user = await db.collection<User>('Users').findOne({
      userId: session?.userId,
    })

    // return the user
    return user
  } catch (error: any) {
    console.log('Error getting session:', error?.data || error)
  }

  return null
}

export async function requiresAuthSession(event: H3Event) {
  const user: User = event.context.user

  if (!user) {
    throw createError({
      statusMessage: 'Unauthorized session.',
      statusCode: 401,
    })
  }

  return user
}

export function generateSessionId(count: number = 50) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < count; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
