import { useCookie, navigateTo } from '#imports'

export const authLogout = async () => {
  const sessionId = useCookie('sessionId')
  try {
    $fetch('/api/mongodb-auth/logout', {
      method: 'POST',
      body: {
        sessionId: sessionId.value,
      },
    })
    sessionId.value = null
  } catch (error) {
    console.log('Error logging out:', error)
  }
  navigateTo('/login')
}
