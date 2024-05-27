import {
	Box,
	Typography,
	capitalize,
} from "@mui/material";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getIssueOrderingFn } from "~core/sorting";
import { normalizeDateString } from "~core/time";
import {
	getIssueFilterPrefOwnerType,
	getIssueFilterPrefState,
} from "~database/preferences";
import { GenericSelectOption } from "~types/generics";
import { RepoIssueSchema } from "~types/schemas";
import { StyledDataTable } from "../StyledDataTable";
import { StyledToolbar } from "./StyledToolbar";

type HeadCell = {
	id: keyof RepoIssueSchema;
	label: string;
	render: (issue: RepoIssueSchema) => ReactNode;
};
const COLUMN_DEFINITION: HeadCell[] = [
	{
		id: "title",
		label: "Title",
		render: (issue) => (
			<Typography
				component={Link}
				to={`/Repositories/${issue.repo_full_name}/Issues/${issue.issue_number}`}
			>
				{issue.title}
			</Typography>
		),
	},
	{
		id: "repo_full_name",
		label: "Repository",
		render: (issue) => (
			<Typography
				component={Link}
				to={`/Repositories/${issue.repo_full_name}`}
			>
				{issue.repo_full_name}
			</Typography>
		),
	},
	{
		id: "issue_number",
		label: "Issue number",
		render: (issue) => issue.issue_number,
	},
	{
		id: "owner_type",
		label: "Type",
		render: (issue) => issue.owner_type,
	},
	{
		id: "state",
		label: "State",
		render: (issue) => capitalize(issue.state),
	},
	{
		id: "updated_at",
		label: "Last updated",
		render: (issue) =>
			normalizeDateString(
				issue.updated_at,
				"Never",
			),
	},
	{
		id: "created_at",
		label: "Created",
		render: (issue) =>
			normalizeDateString(
				issue.created_at,
				"Unknown",
			),
	},
];

type IssueDataTableProps = {
	disableFilter?: boolean;
	orderBy?: keyof RepoIssueSchema;
	issues: RepoIssueSchema[];
	title?: string;
	ownerType?: string;
	repoFullNames?: string[];
	state?: string;
	repoOptions?: GenericSelectOption<string>[];
};
export const IssueDataTable: React.FC<
	IssueDataTableProps
> = (props) => {
	const {
		orderBy,
		disableFilter,
		issues,
		repoOptions: loadedRepoOptions,
		title: loadedTitle,
		repoFullNames: loadedRepoFullNames,
		ownerType: loadedOwnerType,
		state: loadedState,
	} = props;

	const title = loadedTitle ?? "";
	const repoFullNames = loadedRepoFullNames ?? [];
	const ownerType =
		loadedOwnerType ??
		getIssueFilterPrefOwnerType();
	const state =
		loadedState ?? getIssueFilterPrefState();
	const repoOptions = loadedRepoOptions ?? [];

	return (
		<Box>
			{!disableFilter && (
				<StyledToolbar
					itemCount={issues.length}
					ownerType={ownerType}
					repoFullNames={repoFullNames}
					repoOptions={repoOptions}
					state={state}
					title={title}
				/>
			)}
			<StyledDataTable
				items={issues}
				columnDefinition={COLUMN_DEFINITION}
				defaultOrderBy={orderBy ?? "updated_at"}
				orderingFn={getIssueOrderingFn}
			/>
		</Box>
	);
};
