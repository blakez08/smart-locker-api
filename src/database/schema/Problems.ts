import { relations } from 'drizzle-orm'
import { boolean, integer, pgTable, text } from 'drizzle-orm/pg-core'
import { spaces } from './Spaces'

export const problems = pgTable(
  'problems',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    description: text().notNull(),
    resolved: boolean().default(false),
    spaceId: integer().notNull(),
  }
)

export const problemsRelations = relations(problems, ({ one }) => ({
  space: one(spaces, {
    fields: [problems.spaceId],
    references: [spaces.id]
  })
}))
