import Database from "@tauri-apps/plugin-sql";
import { getRepositories } from "./auth";

const getDB = async () =>
	Database.load("sqlite:db.sqlite3");

export const updateCacheRepositories =
	async () => {
		const items = await getRepositories();
		const db = await getDB();

		console.log("started");

		const reqs = items.map(async (item) =>
			db.execute(
				"INSERT INTO repositories (id, name, fullName, visibility, status, pushed_at, created_at, updated_at, readme, html_url,description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
				[
					item.id,
					item.name,
					item.fullName,
					item.visibility,
					item.status,
					item.pushedAt,
					item.createdAt,
					item.updatedAt,
					item.readme,
					item.htmlUrl,
					item.description,
				],
			),
		);
		await Promise.all(reqs);
		console.log("Updated cache");
	};
