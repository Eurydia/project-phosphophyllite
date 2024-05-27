import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getRepoOrderingFn } from "~core/sorting";
import { normalizeDateString } from "~core/time";
import {
	getRepoFilterPrefPropertyPrefix,
	getRepoFilterPrefStatus,
	getRepoFilterPrefTopicMatchStrategy,
	getRepoFilterPrefVisibility,
} from "~database/preferences";
import { GenericSelectOption } from "~types/generics";
import { RepoSchema } from "~types/schemas";
import { StyledDataTable } from "../StyledDataTable";
import { StyledToolbar } from "./StyledToolbar";

type DataCell = {
	id: keyof RepoSchema;
	label: string;
	render: (repo: RepoSchema) => ReactNode;
};
const COLUMN_DEFINITION: DataCell[] = [
	{
		id: "full_name",
		label: "Name",
		render: (repo) => (
			<Typography
				component={Link}
				to={`/Repositories/${repo.full_name}`}
			>
				{repo.full_name}
			</Typography>
		),
	},
	{
		id: "is_archived",
		label: "Status",
		render: (repo) =>
			repo.is_archived ? "Archived" : "Active",
	},
	{
		id: "is_private",
		label: "Visibility",
		render: (repo) =>
			repo.is_private ? "Private" : "Public",
	},
	{
		id: "pushed_at",
		label: "Last pushed",
		render: (repo) =>
			normalizeDateString(
				repo.pushed_at,
				"Never",
			),
	},
	{
		id: "updated_at",
		label: "Last updated",
		render: (repo) =>
			normalizeDateString(
				repo.updated_at,
				"Never",
			),
	},
	{
		id: "created_at",
		label: "Created",
		render: (repo) =>
			normalizeDateString(
				repo.created_at,
				"Unknown",
			),
	},
];

type RepoDataTableProps = {
	disableFilter?: boolean;
	orderBy?: keyof RepoSchema;
	repos: RepoSchema[];
	topicOptions?: GenericSelectOption<string>[];
	name?: string;
	topics?: string[];
	topicMatchStrategy?: string;
	visibility?: string;
	status?: string;
	properties?: string[];
};
export const RepoDataTable: React.FC<
	RepoDataTableProps
> = (props) => {
	const {
		orderBy,
		disableFilter,
		repos,
		topicOptions: loadedTopicOptions,
		name: loadedName,
		topicMatchStrategy: loadedTopicMatchStrategy,
		status: loadedStatus,
		topics: loadedTopics,
		visibility: loadedVisibility,
		properties: loadedProperties,
	} = props;

	const name = loadedName ?? "";
	const topicMatchStrategy =
		loadedTopicMatchStrategy ||
		getRepoFilterPrefTopicMatchStrategy();
	const visibility =
		loadedVisibility ||
		getRepoFilterPrefVisibility();
	const status =
		loadedStatus || getRepoFilterPrefStatus();

	const propertyPrefix =
		getRepoFilterPrefPropertyPrefix();

	const topics: string[] = loadedTopics ?? [];
	const properties: string[] =
		loadedProperties ?? [];

	const topicOptions: GenericSelectOption<string>[] =
		[];
	const propertyOptions: GenericSelectOption<string>[] =
		[];
	for (const item of loadedTopicOptions ?? []) {
		if (item.value.startsWith(propertyPrefix)) {
			propertyOptions.push(item);
			continue;
		}
		topicOptions.push(item);
	}

	return (
		<Box>
			{!disableFilter && (
				<StyledToolbar
					itemCount={repos.length}
					name={name}
					status={status}
					topicMatchStrategy={topicMatchStrategy}
					topics={topics}
					properties={properties}
					visibility={visibility}
					topicOptions={topicOptions}
					propertyOptions={propertyOptions}
				/>
			)}
			<StyledDataTable
				items={repos}
				orderingFn={getRepoOrderingFn}
				defaultOrderBy={orderBy ?? "pushed_at"}
				columnDefinition={COLUMN_DEFINITION}
			/>
		</Box>
	);
};
