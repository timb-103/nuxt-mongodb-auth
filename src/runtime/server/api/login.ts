import { ObjectId } from 'mongodb'
import { defineEventHandler, createError, readBody } from 'h3'
import { createSession } from '../utils/session'

// @ts-ignore TODO: fix nuxt-mongodb exports?
import { mongo } from '#nuxt-mongodb'

//@ts-ignore
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
  try {
    const db = mongo.db()
    const { email, password } = await readBody(event)

    // find the user, make sure to escape + as it's common in emails
    const user = await db.collection('Users').findOne({
      email: {
        $regex: email.replace(/\s/g, '').replace(/\+/g, '\\+'),
        $options: 'i',
      },
    })

    // return if the email already exists
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return createError({
        statusCode: 400,
        statusMessage: 'Error logging in (wrong user/password).',
      })
    }

    // add last login time
    db.collection('Users').updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: { 'logins.last': new Date() },
        $inc: { 'logins.count': 1 },
      }
    )

    // create the new session
    await createSession(event, user.userId)

    return 'Logged in.'
  } catch (e) {
    console.log('Error logging in:', e)
  }

  throw createError({
    statusCode: 400,
    statusMessage: 'Error logging in.',
  })
})
