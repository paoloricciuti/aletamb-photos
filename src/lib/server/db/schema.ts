import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const photos = sqliteTable('photos', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	key: text('key').notNull(),
	title: text('title').notNull(),
	description: text('description'),
	url: text('url').notNull(),
	width: integer('width').notNull(),
	height: integer('height').notNull(),
});

export const passwords = sqliteTable('passwords', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	hash: blob({ mode: 'buffer' }).notNull().$type<ArrayBuffer>(),
});

export const sessions = sqliteTable('sessions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	secret: blob({ mode: 'buffer' }).notNull().$type<ArrayBuffer>(),
});
