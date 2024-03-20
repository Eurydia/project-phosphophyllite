import { DBSchema, openDB } from "idb";
import LZString from "lz-string";

export type ProjectSchema = {
	projectId?: number;
	name: string;
	description: string;
	dateCreated: Date;
	lastModified: Date;
};

// export type TicketSchema = {
// 	ticketId?: number | undefined;
// 	projectName: string;
// 	title: string;
// 	content: string;
// 	dateCreated: Date;
// 	dateModified: Date;
// };

interface Database extends DBSchema {
	projects: {
		key: number;
		value: ProjectSchema;
		indexes: {
			"by-date-created": Date;
			"by-last-modified": Date;
		};
	};
	// tickets: {
	// 	key: number;
	// 	value: TicketSchema;
	// 	indexes: {
	// 		"by-project-id": number;
	// 		"by-date-modified": Date;
	// 	};
	// };
}

const dbPromise = openDB<Database>("primary", 1, {
	upgrade(db) {
		const projectStore = db.createObjectStore(
			"projects",
			{
				keyPath: "projectId",
				autoIncrement: true,
			},
		);

		projectStore.createIndex(
			"by-date-created",
			"dateCreated",
		);

		projectStore.createIndex(
			"by-last-modified",
			"lastModified",
		);

		// const ticketStore = db.createObjectStore(
		// 	"tickets",
		// 	{
		// 		autoIncrement: true,
		// 		keyPath: "ticketId",
		// 	},
		// );
		// ticketStore.createIndex(
		// 	"by-project-id",
		// 	"projectId",
		// );
		// ticketStore.createIndex(
		// 	"by-date-modified",
		// 	"dateModified",
		// );
	},
});

export const createProject = async (
	name: string,
	description: string,
) => {
	const db = await dbPromise;
	return await db.add("projects", {
		name,
		lastModified: new Date(Date.now()),
		dateCreated: new Date(Date.now()),
		description:
			LZString.compressToUTF16(description),
	});
};

export const updateProject = async (
	projectId: number,
	name: string,
	description: string,
) => {
	const prev = await (
		await dbPromise
	).get("projects", projectId);

	return (await dbPromise).put("projects", {
		name,
		dateCreated: !prev
			? new Date(Date.now())
			: prev.dateCreated,
		lastModified: new Date(Date.now()),
		description:
			LZString.compressToUTF16(description),
	});
};

export const getProject = async (
	projectId: number,
) => {
	const project = await (
		await dbPromise
	).get("projects", projectId);
	if (!project) {
		return undefined;
	}
	project.description =
		LZString.decompressFromUTF16(
			project.description,
		);
	return project;
};

export const getProjectAll = async () => {
	const projects = await (
		await dbPromise
	).getAll("projects");
	for (let i = 0; i < projects.length; i++) {
		projects[i].description =
			LZString.decompressFromUTF16(
				projects[i].description,
			);
	}
	return projects;
};

// export const createTicket = async (
// 	projectName: string,
// 	title: string,
// 	content: string,
// ) => {
// 	const db = await dbPromise;
// 	db.add("tickets", {
// 		projectName,
// 		title,
// 		content: LZString.compressToUTF16(content),
// 		dateCreated: new Date(Date.now()),
// 		dateModified: new Date(Date.now()),
// 	});
// };

// export const updateTicket = async (
// 	ticketId: number,
// 	title: string,
// 	content: string,
// ) => {
// 	const transaction = (
// 		await dbPromise
// 	).transaction("tickets", "readwrite");
// 	const prev = await transaction.store.get(
// 		ticketId,
// 	);
// 	if (!prev) {
// 		return -1;
// 	}
// 	return await transaction.store.put(
// 		{
// 			...prev,
// 			title,
// 			content: LZString.compressToUTF16(content),
// 			dateModified: new Date(Date.now()),
// 		},
// 		ticketId,
// 	);
// };

// export const getTicket = async (
// 	ticketId: number,
// ) => {
// 	const transaction = (
// 		await dbPromise
// 	).transaction("tickets");
// 	const ticket = await transaction.store.get(
// 		ticketId,
// 	);
// 	if (!ticket) {
// 		return undefined;
// 	}
// 	ticket.content = LZString.decompressFromUTF16(
// 		ticket.content,
// 	);
// 	return ticket;
// };

// export const getTicketAllFromProject = async (
// 	projectId: number,
// ) => {
// 	const transaction = (
// 		await dbPromise
// 	).transaction("tickets");
// 	const tickets = await transaction.store
// 		.index("by-project-id")
// 		.getAll(projectId);

// 	for (let i = 0; i < tickets.length; i++) {
// 		tickets[i].content =
// 			LZString.decompressFromUTF16(
// 				tickets[i].content,
// 			);
// 	}
// 	return tickets;
// };
