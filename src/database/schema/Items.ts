import { relations } from 'drizzle-orm'
import { integer, pgTable, text, boolean } from 'drizzle-orm/pg-core'
import { spaces } from './Spaces'

export const items = pgTable(
  'items',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    spaceId: integer().notNull(),
  }
)

export const itemsRelations = relations(items, ({ one }) => ({
  space: one(spaces, {
    fields: [items.spaceId],
    references: [spaces.id]
  })
}))
