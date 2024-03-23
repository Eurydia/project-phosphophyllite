import {
	CreateNewFolderRounded,
	ExpandMoreRounded,
	FilterListRounded,
} from "@mui/icons-material";
import {
	Autocomplete,
	Button,
	Stack,
	TextField,
} from "@mui/material";
import { FC, useState } from "react";
import {
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { PopoverButton } from "~components/PoppoverButton";
import { SortRuleMenu } from "~components/SortRuleMenu";
import { WithAppBar } from "~views/WithAppBar";
import { TicketList } from "./helper";
import { LoaderData, sortRules } from "./loader";

export const TicketIdx: FC = () => {
	const {
		projectId,
		tickets,
		sortRule: loadedSortRule,
		tagFilters: loadedTagFilters,
		tagOptions,
	} = useLoaderData() as LoaderData;
	const submit = useSubmit();

	const [selectedTags, setSelectedTags] =
		useState(loadedTagFilters);

	const redirectToTicketCreate = () => {
		if (!projectId) {
			return;
		}
		submit(
			{
				projectId,
			},
			{
				action: "/ticket/create",
				method: "get",
			},
		);
	};

	const handleSortRuleChange = (
		value: string,
	) => {
		submit(
			{
				projectId: projectId || "",
				sortRule: value,
				tags: selectedTags,
			},
			{ action: "/ticket", method: "get" },
		);
	};
	const handleFilterSubmit = () => {
		submit(
			{
				projectId: projectId || "",
				sortRule: loadedSortRule || "",
				tags: selectedTags,
			},
			{
				action: "/ticket",
				method: "get",
			},
		);
	};

	return (
		<WithAppBar
			location="Tickets"
			seconadaryNav={
				<Button
					disabled={projectId === null}
					variant="contained"
					startIcon={<CreateNewFolderRounded />}
					onClick={redirectToTicketCreate}
				>
					New ticket
				</Button>
			}
		>
			<Stack
				spacing={2}
				padding={2}
			>
				<Stack
					spacing={1}
					direction="row"
					width="50%"
				>
					<Autocomplete
						multiple
						size="small"
						limitTags={3}
						options={tagOptions}
						value={selectedTags}
						onChange={(_, values) =>
							setSelectedTags(values)
						}
						sx={{
							width: "70%",
						}}
						renderInput={(param) => (
							<TextField
								{...param}
								label="Tags"
							/>
						)}
					/>
					<Button
						disableElevation
						variant="outlined"
						disabled={selectedTags.length === 0}
						onClick={handleFilterSubmit}
						startIcon={<FilterListRounded />}
					>
						filter
					</Button>
					<PopoverButton
						buttonProps={{
							disableElevation: true,
							variant: "outlined",
							startIcon: <ExpandMoreRounded />,
						}}
					>
						<SortRuleMenu
							sortRules={sortRules}
							rule={loadedSortRule}
							onChange={handleSortRuleChange}
						/>
					</PopoverButton>
				</Stack>
				<TicketList tickets={tickets} />
			</Stack>
		</WithAppBar>
	);
};
