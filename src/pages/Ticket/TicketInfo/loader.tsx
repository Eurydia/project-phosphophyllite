import {
	LoaderFunction,
	json,
} from "react-router";
import { getTagsAll, getTicket } from "~database";
import { TicketSchema } from "~types/schemas";

export type LoaderData = {
	ticket: TicketSchema;
	tagOptions: string[];
};
export const loaderTicketInfo: LoaderFunction =
	async ({ params }) => {
		if (!params.ticketId) {
			throw json(
				{},
				{
					status: 400,
					statusText: "Bad request.",
				},
			);
		}
		const ticketId = Number.parseInt(
			params.ticketId,
		);
		if (!Number.isFinite(ticketId)) {
			throw json(
				{},
				{
					status: 404,
					statusText:
						"Invalid ticket identifier.",
				},
			);
		}
		const ticket = await getTicket(ticketId);
		if (!ticket) {
			throw json(
				{},
				{
					status: 404,
					statusText: "Ticket not found.",
				},
			);
		}
		document.title = ticket.title;
		const tagOptions = await getTagsAll();
		return { ticket, tagOptions };
	};
