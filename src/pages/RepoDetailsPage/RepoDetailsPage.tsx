import {
	Box,
	Container,
	Divider,
	List,
	ListItem,
	ListItemText,
	Tab,
	Tabs,
	Toolbar,
} from "@mui/material";
import { Buffer } from "buffer";
import { FC, ReactNode } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { Markdown } from "~components/Markdown";
import { toTimeStamp } from "~core/time";
import { RepoSchema } from "~types/schemas";
import { MainView } from "~views/MainView";
import { LoaderData } from "./loader";

const REPO_METADATA_DEFINITIONS: {
	label: string;
	render: (repo: RepoSchema) => ReactNode;
}[] = [
	{
		label: "Description",
		render: (repo) =>
			repo.description ?? "No description",
	},
	{
		label: "Last pushed",
		render: (repo) =>
			toTimeStamp(repo.pushed_at, "Never"),
	},
	{
		label: "Last updated",
		render: (repo) =>
			toTimeStamp(repo.updated_at, "Never"),
	},
	{
		label: "Created",
		render: (repo) =>
			toTimeStamp(repo.created_at, "Unknown"),
	},
];

type RepoDetailsPageProps = { tab: number };
export const RepoDetailsPage: FC<
	RepoDetailsPageProps
> = (props) => {
	const { tab } = props;
	const {
		repoOptions,
		repo,
		issues,
		title,
		ownerType,
		repoFullNames,
		state,
	} = useLoaderData() as LoaderData;

	const submit = useSubmit();
	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		let path = `/repositories/${repo.full_name}`;
		if (value === 1) {
			path = `${path}/issues`;
		}
		submit({}, { action: path, method: "get" });
	};

	let decodedReadme: string | undefined;
	if (repo.readme !== undefined) {
		decodedReadme = Buffer.from(
			repo.readme,
			"base64",
		).toString();
	}

	let path = `~/Repositories/${repo.full_name}`;
	if (tab === 1) {
		path = `${path}/Issues`;
	}

	return (
		<MainView location={path}>
			<Toolbar
				disableGutters
				variant="dense"
			>
				<Tabs
					value={tab}
					onChange={handleTabChange}
				>
					<Tab
						value={0}
						label="Readme"
					/>
					<Tab
						value={1}
						label="Issues"
					/>
				</Tabs>
			</Toolbar>
			<Divider />
			{tab !== 1 ? (
				<Container
					maxWidth="sm"
					sx={{ paddingY: 4 }}
				>
					<Markdown
						emptyText="This repository does not contain a readme."
						markdownContent={decodedReadme}
					/>
					<List
						dense
						disablePadding
					>
						{REPO_METADATA_DEFINITIONS.map(
							({ label, render }) => (
								<ListItem
									key={label}
									disableGutters
								>
									<ListItemText
										secondary={render(repo)}
										primary={label}
									/>
								</ListItem>
							),
						)}
					</List>
				</Container>
			) : (
				<Box padding={2}>
					<IssueDataTable
						repoOptions={repoOptions}
						issues={issues}
						title={title}
						ownerType={ownerType}
						repoFullNames={repoFullNames}
						state={state}
					/>
				</Box>
			)}
		</MainView>
	);
};
