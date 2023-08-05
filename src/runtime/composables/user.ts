import { User } from '../../user'

export const useAuthUser = async () => {
  try {
    const user = await $fetch<User>('/api/mongodb-auth/user', {
      method: 'POST',
    })
    return user
  } catch (error) {
    console.log('Error getting auth user:', error)
  }
  return null
}
