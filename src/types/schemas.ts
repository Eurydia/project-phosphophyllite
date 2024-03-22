export type ProjectSchema = {
	projectId?: number;
	name: string;
	description: string;
	dateCreated: Date;
	lastModified: Date;
	tags: string[];
};
