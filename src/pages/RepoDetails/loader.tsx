import { LoaderFunction } from "react-router";
import {
	getCachedIssues,
	getCachedRepo,
} from "~database/cached";
import { RepoIssueSchema } from "~types/schemas";

export type LoaderData =
	| {
			tab: "readme";
			readme: string | undefined;
			topics: string[] | undefined;
	  }
	| {
			tab: "metadata";
			created_at: string | null;
			updated_at: string | null;
			pushed_at: string | null;
			description: string | null | undefined;
			html_url: string;
			homepage: string | null;
			is_private: boolean;
			is_archived: boolean;
	  }
	| { tab: "issues"; issues: RepoIssueSchema[] };
export const loaderProjectInfo: LoaderFunction =
	async ({ params, request }) => {
		const owner = params.owner;
		const repoName = params.repo;
		if (
			owner === undefined ||
			repoName === undefined
		) {
			throw new Response("", {
				status: 400,
				statusText: "Bad requeset",
			});
		}

		const fullName = `${owner}/${repoName}`;
		let repo = await getCachedRepo(fullName);
		if (repo === undefined) {
			throw new Response("Not found", {
				status: 404,
				statusText:
					"Repository not found in cache",
			});
		}
		document.title = repo.name;
		const searchParam = new URL(request.url)
			.searchParams;
		const tabParam = searchParam.get("tab");
		let loaderData: LoaderData = {
			tab: "readme",
			readme: repo.readme,
			topics: repo.topics,
		};
		if (
			tabParam === "issues" &&
			repo !== undefined
		) {
			loaderData = {
				tab: "issues",
				issues: await getCachedIssues(repo.id),
			};
		}
		if (
			tabParam === "metadata" &&
			repo !== undefined
		) {
			loaderData = {
				...repo,
				tab: "metadata",
			};
		}
		return loaderData;
	};
