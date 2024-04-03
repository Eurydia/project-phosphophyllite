import { Octokit, RequestError } from "octokit";
import { FileContentSchema } from "~types/schemas";

const getToken = () => {
	const token = localStorage.getItem(
		"personal-key",
	);
	if (token === null) {
		return "-1";
	}
	return token;
};

export const getRepos = async () => {
	const token = getToken();
	const octokit = new Octokit({ auth: token });

	return octokit
		.request("GET /user/repos", { type: "all" })
		.then(({ data }) => {
			return data.map(
				({
					name,
					full_name,
					topics,
					visibility,
					created_at,
					updated_at,
					description,
					archived: is_archived,
					private: is_private,
				}) => {
					return {
						name,
						full_name,
						description,
						topics,
						visibility,
						created_at,
						updated_at,
						is_archived,
						is_private,
					};
				},
			);
		})
		.catch((r) => {
			throw r as RequestError;
		});
};

export const getRepoContentReadMe = async (
	fullName: string,
) => {
	const token = getToken();
	const ocktokit = new Octokit({ auth: token });
	const [owner, repo] = fullName.split("/");
	const { data } = await ocktokit.request(
		"GET /repos/{owner}/{repo}/readme",
		{
			owner,
			repo,
		},
	);
	const fileData: FileContentSchema = {
		repo_full_name: fullName,
		size: data.size,
		encoding: data.encoding,
		content: data.content,
	};
	return fileData;
};
