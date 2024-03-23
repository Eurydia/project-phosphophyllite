import {
	CreateNewFolderRounded,
	ExpandMoreRounded,
	FilterListRounded,
} from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { FC, useState } from "react";
import {
	Link as RouterLink,
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { PopoverButton } from "~components/PoppoverButton";
import { SortRuleMenu } from "~components/SortRuleMenu";
import { StyledAutocomplete } from "~components/TagAutocomplete";
import { WithAppBar } from "~views/WithAppBar";
import { ProjectList } from "./helper";
import { LoaderData, sortRules } from "./loader";

export const Home: FC = () => {
	const {
		projects,
		sortRule,
		filterTags,
		tagOptions,
	} = useLoaderData() as LoaderData;

	const submit = useSubmit();
	const [selectedTags, setSelectedTags] =
		useState(filterTags);

	const handleSortRuleChange = (
		value: string,
	) => {
		submit(
			{
				sortRule: value,
				tags: selectedTags,
			},
			{ action: "/", method: "get" },
		);
	};

	const handleFilterSubmit = () => {
		submit(
			{
				sortRule: sortRule || "",
				tags: selectedTags,
			},
			{
				action: "/",
				method: "get",
			},
		);
	};

	return (
		<WithAppBar
			location="Projects"
			seconadaryNav={
				<Button
					disableElevation
					variant="contained"
					component={RouterLink}
					startIcon={<CreateNewFolderRounded />}
					to="/project/create"
				>
					new project
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
					<StyledAutocomplete
						options={tagOptions}
						value={selectedTags}
						onChange={setSelectedTags}
						width="70%"
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
							rule={sortRule}
							onChange={handleSortRuleChange}
						/>
					</PopoverButton>
				</Stack>
				<ProjectList projects={projects} />
			</Stack>
		</WithAppBar>
	);
};
