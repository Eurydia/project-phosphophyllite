import { DBSchema, openDB } from "idb";
import { RepositorySchema } from "~types/schemas";

interface Database extends DBSchema {
	repositories: {
		key: string;
		value: RepositorySchema;
		indexes: {
			by_update_at: string;
			by_create_at: string;
		};
	};
}

export const dbPromise = openDB<Database>(
	"primary",
	1,
	{
		upgrade(db, oldVersion) {
			if (oldVersion <= 1) {
				const store = db.createObjectStore(
					"repositories",
					{
						keyPath: "name",
					},
				);
				store.createIndex(
					"by_create_at",
					"create_at",
				);
				store.createIndex(
					"by_update_at",
					"update_at",
				);
			}
		},
	},
);
