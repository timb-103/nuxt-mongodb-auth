export default defineNuxtRouteMiddleware(() => {
  const sessionId = useCookie('sessionId')

  if (!sessionId.value) {
    return navigateTo('/login')
  }
})
