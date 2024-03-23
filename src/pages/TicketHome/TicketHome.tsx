import {
	CreateNewFolderRounded,
	ExpandMoreRounded,
	FilterListRounded,
} from "@mui/icons-material";
import {
	Autocomplete,
	Button,
	ButtonGroup,
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
import { StyledAutocomplete } from "~components/TagAutocomplete";
import { WithAppBar } from "~views/WithAppBar";
import { TicketList } from "./helper";
import { LoaderData, sortRules } from "./loader";

export const TicketIdx: FC = () => {
	const {
		project: loadedProject,
		sortRule: loadedSortRule,
		tagFilters: loadedTagFilters,
		tickets,
		projectOptions,
		tagOptions,
	} = useLoaderData() as LoaderData;
	const submit = useSubmit();

	const [selectedProject, setSelectedProject] =
		useState(loadedProject);
	const [selectedTags, setSelectedTags] =
		useState(loadedTagFilters);

	const redirectToTicketCreate = () => {
		if (
			!loadedProject ||
			loadedProject.projectId === undefined
		) {
			return;
		}
		submit(
			{
				projectId: loadedProject.projectId,
			},
			{
				action: "/ticket/create",
				method: "get",
			},
		);
	};
	const redirectToProject = () => {
		if (
			!loadedProject ||
			loadedProject.projectId === undefined
		) {
			return;
		}
		submit(
			{},
			{
				action: `/project/${loadedProject.projectId}`,
				method: "get",
			},
		);
	};
	const handleSortRuleChange = (
		value: string,
	) => {
		let projectId: string = "";
		if (
			selectedProject !== null &&
			selectedProject.projectId !== undefined
		) {
			projectId =
				selectedProject.projectId.toString();
		}
		submit(
			{
				projectId,
				sortRule: value,
				tags: selectedTags,
			},
			{ action: "/ticket", method: "get" },
		);
	};
	const handleFilterSubmit = () => {
		let projectId: string = "";
		if (
			selectedProject !== null &&
			selectedProject.projectId !== undefined
		) {
			projectId =
				selectedProject.projectId.toString();
		}
		submit(
			{
				projectId,
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
				<ButtonGroup
					disabled={loadedProject === null}
					disableElevation
					variant="contained"
				>
					<Button onClick={redirectToProject}>
						Project home
					</Button>
					<Button
						startIcon={<CreateNewFolderRounded />}
						onClick={redirectToTicketCreate}
					>
						New ticket
					</Button>
				</ButtonGroup>
			}
		>
			<Stack
				spacing={2}
				padding={2}
			>
				<Stack
					spacing={1}
					direction="row"
				>
					<Autocomplete
						size="small"
						options={projectOptions}
						value={selectedProject}
						onChange={(_, value) =>
							setSelectedProject(value)
						}
						getOptionLabel={({
							projectId,
							name,
						}) => `${projectId}- ${name}`}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Project"
								size="small"
							/>
						)}
						sx={{
							width: "40%",
						}}
					/>
					<StyledAutocomplete
						options={tagOptions}
						value={selectedTags}
						onChange={setSelectedTags}
						width="30%"
					/>
					<Button
						disableElevation
						variant="outlined"
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
