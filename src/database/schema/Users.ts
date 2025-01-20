import { relations } from 'drizzle-orm'
import { integer, pgTable, pgEnum, text } from 'drizzle-orm/pg-core'
import { rentals } from './Rentals'

export const currencyEnum = pgEnum('currency', ['USD'])

export const users = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: text().unique().notNull(),
    name: text(),
    password: text().notNull(),
  })

export const usersRelations = relations(users, ({ one, many }) => ({
  rentals: many(rentals)
}))
