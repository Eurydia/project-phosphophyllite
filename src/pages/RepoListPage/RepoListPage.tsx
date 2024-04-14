import { Grid } from "@mui/material";
import { FC, useState } from "react";
import {
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { RepoDataTable } from "~components/RepoDataTable";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { StyledSelectMultiple } from "~components/StyledSelectMultiple";
import { StyledTextField } from "~components/StyledTextField";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

export const RepoListPage: FC = () => {
	const {
		name: loadedName,
		repos,
		topics,
		topicOptions,
	} = useLoaderData() as LoaderData;

	const submit = useSubmit();
	const [name, setName] = useState(loadedName);

	const handleFilterSubmit = () => {
		submit(
			{
				name,
				topics,
			},
			{
				action: "/repositories",
				method: "get",
			},
		);
	};
	const handleTopicChange = (
		value: string[] | string,
	) => {
		submit(
			{
				name,
				topics: value,
			},
			{
				action: "/repositories",
				method: "get",
			},
		);
	};

	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs paths="~/Repositories" />
			}
		>
			<Grid
				container
				spacing={1}
				paddingTop={2}
				paddingX={2}
			>
				<Grid
					item
					xs={12}
					md={7}
				>
					<StyledTextField
						autoComplete="off"
						fullWidth
						placeholder="Search repository"
						size="small"
						value={name}
						onEnter={handleFilterSubmit}
						onChange={setName}
					/>
				</Grid>
				<Grid
					item
					xs={4}
					md={2}
				>
					<StyledSelectMultiple
						fullWidth
						displayEmpty
						renderValue={() => "Topics"}
						size="small"
						value={topics}
						options={topicOptions.map((opt) => ({
							label: opt,
							value: opt,
						}))}
						onChange={(event) =>
							handleTopicChange(
								event.target.value,
							)
						}
					/>
				</Grid>
				<Grid
					item
					xs={12}
				>
					<RepoDataTable repos={repos} />
				</Grid>
			</Grid>
		</WithAppBar>
	);
};
