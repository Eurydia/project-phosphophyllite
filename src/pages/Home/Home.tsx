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
	Link as RouterLink,
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { PopoverButton } from "~components/PoppoverButton";
import { WithAppBar } from "~views/WithAppBar";
import {
	ProjectList,
	SortRuleMenu,
} from "./helper";
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
		<WithAppBar location="Projects">
			<Stack
				spacing={2}
				padding={2}
			>
				<Stack
					spacing={1}
					direction="row"
					justifyContent="space-between"
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
								sortRule={sortRule}
								onChange={handleSortRuleChange}
							/>
						</PopoverButton>
					</Stack>
					<Button
						disableElevation
						variant="contained"
						component={RouterLink}
						startIcon={<CreateNewFolderRounded />}
						to="/project/create"
					>
						new project
					</Button>
				</Stack>
				<ProjectList projects={projects} />
			</Stack>
		</WithAppBar>
	);
};
