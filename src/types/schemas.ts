export type ProjectSchema = {
	projectId?: number;
	name: string;
	description: string;
	dateCreated: Date;
	lastModified: Date;
	tags: string[];
};

export type TicketSchema = {
	ticketId?: number;
	projectId: number;
	title: string;
	content: string;
	dateCreated: Date;
	lastModified: Date;
	tags: string[];
};
