import { DBSchema, openDB } from "idb";
import LZString from "lz-string";

import {
	ProjectSchema,
	TicketSchema,
} from "~types/schemas";

interface Database extends DBSchema {
	projects: {
		key: number;
		value: ProjectSchema;
	};
	tickets: {
		key: number;
		value: TicketSchema;
		indexes: {
			"by-project-id": number;
		};
	};
}
const dbPromise = openDB<Database>("primary", 2, {
	upgrade(db) {
		if (db.version >= 2) {
			const ticketStore = db.createObjectStore(
				"tickets",
				{
					keyPath: "ticketId",
					autoIncrement: true,
				},
			);
			ticketStore.createIndex(
				"by-project-id",
				"projectId",
			);
		}
		if (db.version >= 1) {
			db.createObjectStore("projects", {
				keyPath: "projectId",
				autoIncrement: true,
			});
		}
	},
});

export const createProject = async (
	name: string,
	description: string,
	tags: string[],
) => {
	const db = await dbPromise;
	return await db.add("projects", {
		name: name.normalize(),
		tags: tags.map((tag) => tag.normalize()),
		lastModified: new Date(Date.now()),
		dateCreated: new Date(Date.now()),
		description: LZString.compressToUTF16(
			description.normalize(),
		),
	});
};

export const updateProject = async (
	projectId: number,
	name: string,
	description: string,
	tags: string[],
) => {
	const prev = await (
		await dbPromise
	).get("projects", projectId);

	return (await dbPromise).put("projects", {
		projectId,
		name: name.normalize().trim(),
		tags: tags.map((tag) => tag.normalize()),
		dateCreated: !prev
			? new Date(Date.now())
			: prev.dateCreated,
		lastModified: new Date(Date.now()),
		description: LZString.compressToUTF16(
			description.normalize().trim(),
		),
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

export const createTicket = async (
	projectId: number,
	title: string,
	content: string,
	tags: string[],
) => {
	return await (
		await dbPromise
	).add("tickets", {
		projectId,
		title: title.normalize(),
		tags: tags.map((tag) => tag.normalize()),
		lastModified: new Date(Date.now()),
		dateCreated: new Date(Date.now()),
		content: LZString.compressToUTF16(
			content.normalize(),
		),
	});
};

export const updateTicket = async (
	ticketId: number,
	title: string,
	content: string,
	tags: string[],
) => {
	const prev = await (
		await dbPromise
	).get("tickets", ticketId);

	if (!prev || !prev.projectId) {
		return ticketId;
	}

	return (await dbPromise).put("tickets", {
		ticketId,
		projectId: prev.projectId,
		title: title.normalize(),
		tags: tags.map((tag) => tag.normalize()),
		dateCreated: prev.dateCreated,
		lastModified: new Date(Date.now()),
		content: LZString.compressToUTF16(
			content.normalize(),
		),
	});
};

export const getTicket = async (
	ticketId: number,
) => {
	const ticket = await (
		await dbPromise
	).get("tickets", ticketId);

	if (!ticket) {
		return undefined;
	}
	ticket.content = LZString.decompressFromUTF16(
		ticket.content,
	);
	return ticket;
};

export const getTicketAll = async () => {
	const tickets = await (
		await dbPromise
	).getAll("tickets");

	for (let i = 0; i < tickets.length; i++) {
		tickets[i].content =
			LZString.decompressFromUTF16(
				tickets[i].content,
			);
	}
	return tickets;
};

export const getTicketAllFromProject = async (
	projectId: number,
) => {
	const tickets = await (
		await dbPromise
	).getAllFromIndex(
		"tickets",
		"by-project-id",
		projectId,
	);
	for (let i = 0; i < tickets.length; i++) {
		tickets[i].content =
			LZString.decompressFromUTF16(
				tickets[i].content,
			);
	}
	return tickets;
};

export const getTagsAll = async () => {
	const projects = await getProjectAll();
	const tickets = await getTicketAll();

	const uniqueTags: Set<string> = new Set([
		"open",
		"close",
	]);
	for (const project of projects) {
		for (const tag of project.tags) {
			uniqueTags.add(tag);
		}
	}
	for (const ticket of tickets) {
		for (const tag of ticket.tags) {
			uniqueTags.add(tag);
		}
	}
	const tags: string[] = [...uniqueTags];
	tags.sort();
	return tags;
};
