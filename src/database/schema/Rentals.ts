import { relations } from 'drizzle-orm'
import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core'
import { spaces } from './Spaces'
import { users } from './Users'

export const rentals = pgTable(
  'rentals',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    spaceId: integer().notNull(),
    userId: integer().notNull(),
    startTime: timestamp().defaultNow().notNull(),
    endTime: timestamp()
  })

export const rentalsRelations = relations(rentals, ({ one, many }) => ({
  space: one(spaces, {
    fields: [rentals.spaceId],
    references: [spaces.id]
  }),
  user: one(users, {
    fields: [rentals.userId],
    references: [users.id]
  })
}))
