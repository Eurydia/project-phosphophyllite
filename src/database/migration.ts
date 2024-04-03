import { DBSchema, openDB } from "idb";
import {
	FileContentSchema,
	RepositorySchema,
} from "~types/schemas";

interface Database extends DBSchema {
	readmes: {
		key: string;
		value: FileContentSchema;
	};
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
	3,
	{
		upgrade(db, oldVersion) {
			if (oldVersion <= 0) {
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
			if (oldVersion <= 1) {
				db.deleteObjectStore("repositories");
				db.createObjectStore("repositories", {
					keyPath: "fullname",
				});
			}
			if (oldVersion <= 2) {
				db.deleteObjectStore("repositories");
				db.createObjectStore("repositories", {
					keyPath: "full_name",
				});
				db.createObjectStore("readmes", {
					keyPath: "repo_full_name",
				});
			}
		},
	},
);
