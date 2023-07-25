import { User } from 'types/user'

export const authLogin = async (email: string, password: string) => {
  await $fetch('/api/auth/login', {
    method: 'POST',
    body: {
      email: email,
      password: password,
    },
  })
}

export const authRegister = async (email: string, password: string) => {
  await $fetch('/api/auth/register', {
    method: 'POST',
    body: {
      email: email,
      password: password,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Etc/GMT',
    },
  })
}

export const authUser = async () => {
  try {
    const user = await $fetch<User>('/api/auth/user', {
      method: 'POST',
    })
    return user
  } catch (error) {
    console.log('Error getting auth user:', error)
  }
  return null
}

export const authLogout = async () => {
  const sessionId = useCookie('sessionId')
  try {
    $fetch('/api/auth/logout', {
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
