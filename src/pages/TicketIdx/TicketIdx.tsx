import {
	FC,
	Fragment,
	useRef,
	useState,
} from "react";
import {
	Box,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	MenuList,
	Popover,
	Stack,
} from "@mui/material";
import {
	createSearchParams,
	useLoaderData,
	useNavigate,
} from "react-router-dom";
import {
	CheckRounded,
	CreateNewFolderRounded,
	ExpandMoreRounded,
	OpenInNewRounded,
} from "@mui/icons-material";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData, sortRules } from "./loader";

export const TicketIdx: FC = () => {
	const navigate = useNavigate();
	const { projectId, tickets, sortRule } =
		useLoaderData() as LoaderData;

	const sortButtonRef =
		useRef<HTMLButtonElement | null>(null);
	const [sortMenuAnchor, setSortMenuAnchor] =
		useState<HTMLButtonElement | null>(null);

	return (
		<Fragment>
			<WithAppBar location="Tickets">
				<Box padding={4}>
					<Stack
						direction="row"
						justifyContent="space-between"
					>
						<Button
							disabled={projectId === null}
							variant="contained"
							startIcon={
								<CreateNewFolderRounded />
							}
							onClick={() => {
								navigate(
									`/ticket/create?${createSearchParams(
										{
											projectId:
												projectId!.toString(),
										},
									)}`,
								);
							}}
						>
							New ticket
						</Button>
						<Button
							ref={sortButtonRef}
							variant="outlined"
							endIcon={<ExpandMoreRounded />}
							onClick={() =>
								setSortMenuAnchor(
									sortButtonRef.current,
								)
							}
						>
							Sort
						</Button>
					</Stack>
					<List>
						{tickets.map((ticket, index) => (
							<ListItem key={`ticket-${index}`}>
								<ListItemText
									inset
									title={ticket.title}
									primaryTypographyProps={{
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										width: "50%",
									}}
									secondary={ticket.tags.join(
										", ",
									)}
									secondaryTypographyProps={{
										width: "50%",
									}}
								>
									{ticket.title}
								</ListItemText>
								<ListItemSecondaryAction>
									<IconButton
										title="Open"
										onClick={() =>
											navigate(
												`./${ticket.ticketId}`,
											)
										}
									>
										<OpenInNewRounded />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				</Box>
			</WithAppBar>
			<Popover
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				anchorEl={sortMenuAnchor}
				open={sortMenuAnchor !== null}
				onClose={() => setSortMenuAnchor(null)}
			>
				<MenuList>
					{sortRules.map(({ label, value }) => (
						<MenuItem
							key={value}
							value={value}
							onClick={() =>
								navigate(
									`.?${createSearchParams({
										sortBy: value,
									})}`,
								)
							}
						>
							<ListItemIcon>
								{(value === sortRule ||
									(!sortRule &&
										value ===
											"lastModified")) && (
									<CheckRounded />
								)}
							</ListItemIcon>
							<ListItemText>{label}</ListItemText>
						</MenuItem>
					))}
				</MenuList>
			</Popover>
		</Fragment>
	);
};
