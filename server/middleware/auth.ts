/**
 * On every request to the server it will take the cookie, check if it has
 * an active session and add the user to the context object.
 *
 * It won't block the requests, so in each API route we will have to add a function that checks
 * this context user object to see if it's present and if not, throw an error.
 */

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event)
  const user = await getSessionUser(cookies?.sessionId)
  if (user) {
    event.context.user = user
  }
})
