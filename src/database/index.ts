import { DBSchema, openDB } from "idb";

export type ProjectModel = {
	id: number;
	name: string;
	description: string;
};

type TicketModel = {
	projectId: number;
	id: number;
	name: string;
	content: string;
	dateCreated: string;
	dateModified: string;
};

interface Database extends DBSchema {
	projects: {
		key: number;
		value: ProjectModel;
	};
	tickets: {
		key: number;
		value: TicketModel;
		indexes: { "by-project": number };
	};
}

const dbPromise = openDB<Database>("primary", 2, {
	upgrade(database) {
		database.createObjectStore("projects", {
			keyPath: "id",
			autoIncrement: true,
		});

		const ticketStore =
			database.createObjectStore("tickets", {
				keyPath: "id",
				autoIncrement: true,
			});
		ticketStore.createIndex(
			"by-project",
			"projectId",
		);
	},
});

export const createProject = async (
	value: ProjectModel,
) => {
	const db = await dbPromise;
	const tx = db.transaction(
		"projects",
		"readwrite",
	);
	return await tx.store.add(value);
};

export const updateProject = async (
	key: number,
	value: ProjectModel,
) => {
	const db = await dbPromise;
	const tx = db.transaction(
		"projects",
		"readwrite",
	);
	return await tx.store.put(value, key);
};

export const listProject = async () => {
	const db = await dbPromise;
	const tx = db.transaction(
		"projects",
		"readonly",
	);
	const store = tx.objectStore("projects");
	const records = await store.getAll();
	return records;
};
