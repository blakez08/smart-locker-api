import { drizzle } from 'drizzle-orm/node-postgres'
import mySchema from './schema'

const db = drizzle(process.env.DATABASE_URL!, {
  schema: mySchema
})

export default db

export const schema = mySchema
