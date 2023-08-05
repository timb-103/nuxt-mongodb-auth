export const authLogin = async (email: string, password: string) => {
  await $fetch('/api/mongodb-auth/login', {
    method: 'POST',
    body: {
      email: email,
      password: password,
    },
  })
}
