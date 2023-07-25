# Nuxt 3 MongoDB Auth

A simple Nuxt 3 user authentication system using mongoDB to store users & sessions.

## Install

Install the layer:

```sh
npm i -D nuxt-mongodb-auth
```

Add the layer in the `extends` array in `nuxt.config.ts`:

```js
export default defineNuxtConfig({
  extends: ['nuxt-mongodb-auth'],
})
```

Add your mongo connection string and main database name in your `.env` file:

```
MONGO_CONNECTION_STRING=
MONGO_DB=
```

## Usage

To handle the user auth flow, you can use these simple composables in any of your pages:

- `authRegister()`
- `authLogin()`
- `authLogout()`
- `authUser()`

## Server side authentication

When calling your protected API routes, add this at the top of your file:

```js
export default defineEventHandler(async (event) => {
  const user = requiresAuthSession(event)
})
```

If the user has no authorized session, it will throw an error and return before executing any more code.

## MongoDB Connection

When you start your project, mongo will connect and you can use it anywhere, eg:

```js
const db = mongo.db()
const response = await db.collection('YOUR_COLLECTION').find()
```
