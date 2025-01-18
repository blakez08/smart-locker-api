import { relations } from 'drizzle-orm'
import { integer, index, pgTable, geometry, text } from 'drizzle-orm/pg-core'
import { spaces } from './Spaces'

export const lockers = pgTable(
  'lockers',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    location: geometry('location', {
      type: 'point',
      mode: 'tuple',
      srid: 4326
    }).notNull()
  },
  (t) => [index('spatial_index').using('gist', t.location)]
)

export const lockersRelations = relations(lockers, ({ many }) => ({
  spaces: many(spaces)
}))
