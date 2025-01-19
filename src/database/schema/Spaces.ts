import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, pgEnum } from 'drizzle-orm/pg-core'
import { lockers } from './Lockers'
import { items } from './Items'
import { problems } from './Problems'
import { rentals } from './Rentals'

export const currencyEnum = pgEnum('currency', ['USD'])

export const spaces = pgTable(
  'spaces',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    position: integer().notNull(),
    available: boolean().default(true),
    price: integer().notNull(),
    currency: currencyEnum().default('USD'),
    lockerId: integer().notNull(),
  })

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  locker: one(lockers, {
    fields: [spaces.lockerId],
    references: [lockers.id]
  }),
  items: many(items),
  problems: many(problems),
  rentals: many(rentals)
}))
