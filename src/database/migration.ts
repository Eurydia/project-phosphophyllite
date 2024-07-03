import {
	DBSchema,
	IDBPDatabase,
	openDB,
} from "idb";
import {
	Comment,
	Issue,
	Repository,
} from "~types/schema";

interface Database extends DBSchema {
	repos: {
		key: string;
		value: Repository;
		indexes: {
			"by-fullName": string;
		};
	};
	issues: {
		key: number;
		value: Issue;
		indexes: {
			"by-repoId": number;
		};
	};
	issueComments: {
		key: number;
		value: Comment;
		indexes: {
			"by-issueId": number;
		};
	};
}

const db1 = (db: IDBPDatabase<Database>) => {
	const repoStore = db.createObjectStore(
		"repos",
		{
			keyPath: "id",
			autoIncrement: false,
		},
	);
	repoStore.createIndex(
		"by-fullName",
		"fullName",
		{
			unique: true,
			multiEntry: false,
		},
	);
	const issueStore = db.createObjectStore(
		"issues",
		{
			keyPath: "id",
			autoIncrement: false,
		},
	);
	issueStore.createIndex("by-repoId", "repoId", {
		multiEntry: true,
		unique: false,
	});
	const issueCommentStore = db.createObjectStore(
		"issueComments",
		{
			keyPath: "id",
			autoIncrement: false,
		},
	);
	issueCommentStore.createIndex(
		"by-issueId",
		"issueId",
		{ multiEntry: true, unique: false },
	);
};

export const dbPromise = openDB<Database>(
	"primary",
	1,
	{
		upgrade(db, oldVersion) {
			if (oldVersion < 1) {
				db1(db);
			}
		},
	},
);
