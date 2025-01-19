import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable } from 'drizzle-orm/pg-core'
import { lockers } from './Lockers'
import { items } from './Items'
import { problems } from './Problems'

export const spaces = pgTable(
  'spaces',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    position: integer().notNull(),
    available: boolean().default(true),
    lockerId: integer().notNull(),
  })

export const spacesRelations = relations(spaces, ({ one, many }) => ({
  locker: one(lockers, {
    fields: [spaces.lockerId],
    references: [lockers.id]
  }),
  items: many(items),
  problems: many(problems)
}))
