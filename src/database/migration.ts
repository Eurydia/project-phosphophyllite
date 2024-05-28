import {
	DBSchema,
	IDBPDatabase,
	openDB,
} from "idb";
import {
	CommentSchema,
	IssueSchema,
	RepoSchema,
} from "~types/schemas";

interface Database extends DBSchema {
	repos: {
		key: string;
		value: RepoSchema;
		indexes: {
			"by-full_name": string;
			"by-id": number;
		};
	};
	issues: {
		key: number;
		value: IssueSchema;
		indexes: {
			"by-repo_id": number;
		};
	};
	issueComments: {
		key: number;
		value: CommentSchema;
		indexes: {
			"by-issue_id": number;
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
		"by-full_name",
		"full_name",
		{
			unique: true,
			multiEntry: false,
		},
	);
	repoStore.createIndex("by-id", "id", {
		unique: true,
		multiEntry: false,
	});
	const issueStore = db.createObjectStore(
		"issues",
		{
			keyPath: "id",
			autoIncrement: false,
		},
	);
	issueStore.createIndex(
		"by-repo_id",
		"repo_id",
		{ multiEntry: true, unique: false },
	);
	const issueCommentStore = db.createObjectStore(
		"issueComments",
		{
			keyPath: "id",
			autoIncrement: false,
		},
	);
	issueCommentStore.createIndex(
		"by-issue_id",
		"issue_id",
		{ multiEntry: true, unique: false },
	);
};

export const dbPromise = openDB<Database>(
	"primary",
	2,
	{
		upgrade(db, oldVersion) {
			if (oldVersion < 1) {
				db1(db);
			}
		},
	},
);
