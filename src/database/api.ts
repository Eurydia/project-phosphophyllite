import { Octokit, RequestError } from "octokit";

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
		.request("GET /user/repos", { type: "owner" })
		.then(({ data }) => {
			return data.map(
				({
					name,
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
