import { DBSchema, openDB } from "idb";
import {
	RepoIssueCommentSchema,
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";

interface Database extends DBSchema {
	repos: {
		key: string;
		value: RepoSchema;
		indexes: {
			"by-full_name": string;
		};
	};
	issues: {
		key: number;
		value: RepoIssueSchema;
		indexes: {
			"by-repo_id": number;
		};
	};
	issueComments: {
		key: number;
		value: RepoIssueCommentSchema;
		indexes: {
			"by-issue_id": number;
		};
	};
}

export const dbPromise = openDB<Database>(
	"primary",
	1,
	{
		upgrade(db, oldVersion) {
			if (oldVersion <= 0) {
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
				const issueCommentStore =
					db.createObjectStore("issueComments", {
						keyPath: "id",
						autoIncrement: false,
					});
				issueCommentStore.createIndex(
					"by-issue_id",
					"issue_id",
					{ multiEntry: true, unique: false },
				);
			}
		},
	},
);
