import {
	LoaderFunction,
	json,
} from "react-router";

import { getTicket } from "~database";
import { TicketSchema } from "~types/schemas";

export type LoaderData = TicketSchema | undefined;

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
		return ticket;
	};
