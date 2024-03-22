import { DBSchema, deleteDB, openDB } from "idb";
import LZString from "lz-string";

import { ProjectSchema } from "~types/schemas";

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
// await deleteDB("primary");

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
	tags: string[],
) => {
	const db = await dbPromise;
	return await db.add("projects", {
		name: name.normalize().trim(),
		tags: tags.map((tag) =>
			tag.normalize().trim(),
		),
		lastModified: new Date(Date.now()),
		dateCreated: new Date(Date.now()),
		description: LZString.compressToUTF16(
			description.normalize().trim(),
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
		tags: tags.map((tag) =>
			tag.normalize().trim(),
		),
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

// for (let i = 0; i < 5; i++) {
// 	createProject(
// 		`Test ${i}`,
// 		`# Receptus elidite volubilitas vaga nullam et qui

// ## Ulla vectus Thebis tellus externos serva

// Lorem markdownum, resonabilis talia [argenteus
// dare](http://sunto.net/amnesqueferes) vellet non pignora Thisbe harundinis comes
// bicoloribus hanc terribilesque musta alteraque condit serpentis. Sacrum modo,
// subiecta arcumque in anser, *unam* quod tenax: pro abit. Si lyram contra,
// **cum** capulo Memnonis adesset, intrarunt laetus crinibus. Ingenii qui fuit,
// nitorem, frui per et [meque](http://quo-quae.com/sunt) marmore, nulla maris
// pereo. Addidit caerula sedes: ire illis quidem, vir, nunc!

// 		protector_script.lpiCamelcase += scanDbms(dot, laptop_secondary +
// 						document_web - whoisCluster);
// 		cross_metal_drop = saasSearchYoutube(paperTwitterSlashdot, 2, 3) * -2;
// 		var adOleCard = phreakingIndex * binary_server + -5 + raster;
// 		if (rw_native_parameter >= alu(subnet)) {
// 				read_mask.isdn_boot_ad(snmpSnippet, big, active_xp_domain);
// 				barcraft = architecturePipeline + domain;
// 		} else {
// 				denial_thick_sync = nanometer;
// 		}
// 		var leafIntegratedVdsl = winsock_print_box(archive(mamp_asp_hsf,
// 						publishing_skin) + passive + hardSkyscraper, optic);

// Poste falcata illud inutilior erat, latus quam Dies manu, aristas gestasset
// mirantur super pennis. Victoria votorum. Pugnat ramos ad inrita, Medusa
// gravitate **aequantia ut** aures licet pars dextra. Sic probes loquatur nullae
// et tibi; dixerat barba nondum Charaxi fuit. Collo et caput.

// ## Famulosne fortius ipsum monimenta infectaque iussi

// Ramis et prona dicebat, sed aer Rhodopeius latuere nudaeque stare vero qui
// pulsavere! Tribus coniunx sui est ubi comas satiatae rogabo excutit, de duas. In
// vertar intrat Ulixes rostro ignipedum futuros, inani, ut hic.

// > Limbo Iris hederae esse. Quod munus invita pennis placidissime Thisbes timeo
// > careat habet nocuit faces eripitur est.

// Nulla corpore *illic fuit tura* peti teque, cum ferat, carmen. Non est crate
// exstat **posse**, dextera *nondum currus nefandum* animae et vates celeberrimus
// nutricibus.

// Sine est! Custos aera urbem regnum est laudatis **haec**, iam cum. Sumere
// inania. Aere dixit conplexae, dixerat silentia umbrarumque illo, Mavortis;
// *facta* voce.
// 	`,
// 		Array(i + 1)
// 			.fill(null)
// 			.map((_, index) => index.toString()),
// 	);
// }
