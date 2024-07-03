import zod from "zod";

// export const REPOSITORY_SCHEMA = zod.object({
// 	id: zod
// 		.number()
// 		.int()
// 		.nonnegative()
// 		.safe()
// 		.finite(),
// 	name: zod.string(),
// 	fullName: zod.string(),
// 	visibility: zod.enum(["public", "private"]),
// 	archived: zod.boolean(),
// 	pushedAt: zod.string()| null(),
// 	createdAt: zod.string()| null(),
// 	updatedAt: zod.string()| null(),
// 	readme: zod.string()| undefined(),
// 	htmlUrl: zod.string(),
// 	description: zod.string()| null(),
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


export type Comment = 	{id: zod
.number()
.int()
.nonnegative()
.safe()
.finite(),
issueId: zod
.number()
.int()
.nonnegative()
.safe()
.finite(),
htmlUrl: zod.string(),
body: zod.string() | undefined(),
createdAt: zod.string(),
updatedAt: zod.string()},

export type RepoQuery =
	RepositoryQueryPreference & {
		fullName: string;
	};

export const REPOSITORY_QUERY_PREFERENCE_SCHEMA =
	zod.object({
		status: zod.enum([
			"all",
			"active",
			"archived",
		]),
		visibility: zod.enum([
			"all",
			"private",
			"public",
		]),
		sortBy: zod.enum([
			"fullName",
			"pushedAt",
			"createdAt",
			"updatedAt",
		]),
		sortOrder: zod.enum(["asc", "desc"]),
	});

export const ISSUE_QUERY_PREFERENCE_SCHEMA =
	zod.object({
		ownerType: zod.enum(["all", "bot", "user"]),
		state: zod.enum(["all", "open", "closed"]),
		sortBy: zod.enum([
			"title",
			"updatedAt",
			"createdAt",
		]),
		sortOrder: zod.enum(["asc", "desc"]),
	});

export const AUTO_UPDATE_SETTING_SCHEMA =
	zod.object({
		enabled: zod.boolean(),
		minium_elasped_time_second: zod
			.number()
			.int()
			.nonnegative()
			.safe()
			.finite()
			.gt(300),
	});

export type AutoUpdateSetting = zod.infer<
	typeof AUTO_UPDATE_SETTING_SCHEMA
>;

export const USER_SETTING_SCHEMA = zod.object({
	$schema: zod.string() | undefined(),
	repository: REPOSITORY_QUERY_PREFERENCE_SCHEMA,
	issue: ISSUE_QUERY_PREFERENCE_SCHEMA,
	autoUpdate: AUTO_UPDATE_SETTING_SCHEMA,
});

export type IssueQueryPreference = zod.infer<
	typeof ISSUE_QUERY_PREFERENCE_SCHEMA
>;

export type RepositoryQueryPreference = zod.infer<
	typeof REPOSITORY_QUERY_PREFERENCE_SCHEMA
>;

export type UserSetting = zod.infer<
	typeof USER_SETTING_SCHEMA
>;

export type IssueQuery = IssueQueryPreference & {
	title: string;
};

export const APP_DATA_SCHEMA = zod.object({
	repoDataLastUpdate: zod.string() | null(),
	issueDataLastUpdate: zod.string() | null(),
	commentDataLastUpdate: zod.string() | null(),
});

export type GenericAppData = zod.infer<
	typeof APP_DATA_SCHEMA
>;
