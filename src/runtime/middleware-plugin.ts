import { defineNuxtPlugin, addRouteMiddleware, useCookie, navigateTo } from '#imports'

export default defineNuxtPlugin(() => {
  // auth
  addRouteMiddleware('auth', () => {
    const sessionId = useCookie('sessionId')
    if (!sessionId.value) {
      return navigateTo('/login')
    }
  })

  // not-auth
  addRouteMiddleware('not-auth', () => {
    const sessionId = useCookie('sessionId')
    if (sessionId.value) {
      return navigateTo('/dashboard')
    }
  })
})
