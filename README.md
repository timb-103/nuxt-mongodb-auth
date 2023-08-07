# Nuxt 3 MongoDB Auth

A simple Nuxt 3 user authentication system using mongoDB to store users & sessions.

[Basic Example](https://github.com/timb-103/nuxt-mongodb-auth-example)

## Install

Install the module:

```sh
npm i -D nuxt-mongodb-auth
```

Add `nuxt-mongodb-auth` to the `modules` array in `nuxt.config.ts`:

```js
export default defineNuxtConfig({
  modules: ['nuxt-mongodb-auth'],
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
import { requiresAuthSession } from '#nuxt-mongodb-auth'

export default defineEventHandler(async (event) => {
  const user = await requiresAuthSession(event)
})
```

If the user has no authorized session, it will throw an error and return before executing any more code.

## MongoDB Connection

You can also access the same mongo connection from your server routes:

```js
import { mongo } from '#nuxt-mongodb-auth'

const db = mongo.db()
const response = await db.collection('YOUR_COLLECTION').find()
```
