import { LoaderFunction } from "react-router";
import {
	getCachedIssues,
	getCachedRepo,
} from "~database/cached";
import {
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";

export type LoaderData =
	| {
			tab: "index";
			repo: RepoSchema;
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
			tab: "index",
			repo,
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
		return loaderData;
	};
