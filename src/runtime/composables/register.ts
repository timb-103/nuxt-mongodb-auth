export const useAuthRegister = async (email: string, password: string) => {
  await $fetch('/api/mongodb-auth/register', {
    method: 'POST',
    body: {
      email: email,
      password: password,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Etc/GMT',
    },
  })
}
