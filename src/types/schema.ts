// export const REPOSITORY_SCHEMA = object({
// 	id: zod
// 		.number()
// 		.int()
// 		.nonnegative()
// 		.safe()
// 		.finite(),
// 	name: string(),
// 	fullName: string(),
// 	visibility: enum(["public", "private"]),
// 	archived: boolean(),
// 	pushedAt: string()| null(),
// 	createdAt: string()| null(),
// 	updatedAt: string()| null(),
// 	readme: string()| undefined(),
// 	htmlUrl: string(),
// 	description: string()| null(),
// });

export type Repository = {
	id: number;
	name: string;
	fullName: string;
	visibility: string;
	archived: boolean;
	pushedAt: string | null;
	createdAt: string | null;
	updatedAt: string | null;
	readme: string | undefined;
	htmlUrl: string;
	description: string | null;
};
export type Issue = {
	id: number;
	repoId: number;
	repoFullName: string;
	issueNumber: number;
	title: string;
	state: string;
	ownerType: string | null;
	createdAt: string;
	updatedAt: string;
	closedAt: string | null;
	htmlUrl: string;
	body: string | null | undefined;
};

export type Comment = {
	id: number;
	issueId: number;
	htmlUrl: string;
	body: string | undefined;
	createdAt: string;
	updatedAt: string;
};

// export type RepoQuery =
// 	RepositoryQueryPreference & {
// 		fullName: string;
// 	};

// export const REPOSITORY_QUERY_PREFERENCE_SCHEMA =
// 	object({
// 		status: enum([
// 			"all",
// 			"active",
// 			"archived",
// 		]),
// 		visibility: enum([
// 			"all",
// 			"private",
// 			"public",
// 		]),
// 		sortBy: enum([
// 			"fullName",
// 			"pushedAt",
// 			"createdAt",
// 			"updatedAt",
// 		]),
// 		sortOrder: enum(["asc", "desc"]),
// 	});

// export const ISSUE_QUERY_PREFERENCE_SCHEMA =
// 	object({
// 		ownerType: enum(["all", "bot", "user"]),
// 		state: enum(["all", "open", "closed"]),
// 		sortBy: enum([
// 			"title",
// 			"updatedAt",
// 			"createdAt",
// 		]),
// 		sortOrder: enum(["asc", "desc"]),
// 	});

// export const AUTO_UPDATE_SETTING_SCHEMA =
// 	object({
// 		enabled: boolean,
// 		minium_elasped_time_second: zod
// 			.number()
// 			.int()
// 			.nonnegative()
// 			.safe()
// 			.finite()
// 			.gt(300),
// 	});

// export type AutoUpdateSetting = infer<
// 	typeof AUTO_UPDATE_SETTING_SCHEMA
// >;

// export const USER_SETTING_SCHEMA = object({
// 	$schema: string() | undefined(),
// 	repository: REPOSITORY_QUERY_PREFERENCE_SCHEMA,
// 	issue: ISSUE_QUERY_PREFERENCE_SCHEMA,
// 	autoUpdate: AUTO_UPDATE_SETTING_SCHEMA,
// });

// export type IssueQueryPreference = infer<
// 	typeof ISSUE_QUERY_PREFERENCE_SCHEMA
// >;

// export type RepositoryQueryPreference = infer<
// 	typeof REPOSITORY_QUERY_PREFERENCE_SCHEMA
// >;

// export type UserSetting = infer<
// 	typeof USER_SETTING_SCHEMA
// >;

// export type IssueQuery = IssueQueryPreference & {
// 	title: string;
// };

export type GenericAppData = {
	repoDataLastUpdate: string | null;
	issueDataLastUpdate: string | null;
	commentDataLastUpdate: string | null;
};
