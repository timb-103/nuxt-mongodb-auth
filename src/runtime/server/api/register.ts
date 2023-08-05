import { defineEventHandler, createError } from 'h3'
import { generateSessionId, createSession } from '../utils/session'
import { mongo } from '#nuxt-mongodb'

//@ts-ignore
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  const db = mongo.db()
  const { email, password, timezone } = await readBody(event)
  const userId = generateSessionId(15)

  if (!email || password.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password must be at least 6 characters.',
    })
  }

  try {
    // check if the email already exists
    if (
      await db
        .collection('Users')
        .findOne({ email: { $regex: new RegExp(email.replace(/\s/g, ''), 'i') } })
    ) {
      return createError({
        statusCode: 400,
        statusMessage: 'Email exists. Please try again.',
      })
    }

    // insert user
    await db.collection('Users').insertOne({
      timezone,
      userId,
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      timestamp: new Date(),
      logins: {
        last: new Date(),
      },
    })

    // create the new session
    await createSession(event, userId)

    // return success
    return 'Registered.'
  } catch (e) {
    console.log('Error registering:', e)
  }

  // return an error
  throw createError({
    statusCode: 400,
    statusMessage: 'Register failed. Please try again.',
  })
})
