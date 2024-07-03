import zod from "zod";

export const REPOSITORY_SCHEMA = zod.object({
	id: zod
		.number()
		.int()
		.nonnegative()
		.safe()
		.finite(),
	name: zod.string(),
	fullName: zod.string(),
	visibility: zod.enum(["public", "private"]),
	status: zod.enum(["active", "archived"]),
	pushedAt: zod.string().datetime().nullable(),
	createdAt: zod.string().datetime().nullable(),
	updatedAt: zod.string().datetime().nullable(),
	readme: zod.string().optional(),
	htmlUrl: zod.string(),
	description: zod.string().nullable(),
});

export type Repository = zod.infer<
	typeof REPOSITORY_SCHEMA
>;

export const ISSUE_SCHEMA = zod.object({
	id: zod.number().int().nonnegative(),
	repoId: zod
		.number()
		.int()
		.nonnegative()
		.safe()
		.finite(),
	repoFullName: zod.string(),
	issueNumber: zod.number().int().nonnegative(),
	title: zod.string(),
	state: zod.string(),
	ownerType: zod.string().nullable(),
	createdAt: zod.string().datetime(),
	updatedAt: zod.string().datetime(),
	closedAt: zod.string().datetime().nullable(),
	htmlUrl: zod.string(),
	body: zod.string().nullable().optional(),
});

export type Issue = zod.infer<
	typeof ISSUE_SCHEMA
>;

export const COMMENT_SCHEMA = zod.object({
	id: zod
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
	body: zod.string().optional(),
	createdAt: zod.string().datetime(),
	updatedAt: zod.string().datetime(),
});

export type Comment = zod.infer<
	typeof COMMENT_SCHEMA
>;

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
	$schema: zod.string().optional(),
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
	repoDataLastUpdate: zod
		.string()
		.datetime()
		.nullable(),
	issueDataLastUpdate: zod
		.string()
		.datetime()
		.nullable(),
	commentDataLastUpdate: zod
		.string()
		.datetime()
		.nullable(),
});

export type GenericAppData = zod.infer<
	typeof APP_DATA_SCHEMA
>;
