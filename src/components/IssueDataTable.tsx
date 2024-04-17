import {
	ClearRounded,
	FilterListRounded,
} from "@mui/icons-material";
import {
	Box,
	Collapse,
	IconButton,
	List,
	ListItem,
	ListItemText,
	SelectChangeEvent,
	Stack,
	Toolbar,
	Typography,
	capitalize,
} from "@mui/material";
import {
	FC,
	Fragment,
	ReactNode,
	useState,
} from "react";
import {
	Link,
	useSubmit,
} from "react-router-dom";
import {
	ISSUE_FILTER_OWNER_TYPE_OPTIONS,
	ISSUE_FILTER_STATE_OPTIONS,
} from "~constants";
import {
	orderByNumber,
	orderByString,
} from "~core/sorting";
import { normalizeDateString } from "~core/time";
import {
	getIssueFilterPrefOwnerType,
	getIssueFilterPrefState,
} from "~database/preferences";
import { GenericSelectOptions } from "~types/generics";
import { RepoIssueSchema } from "~types/schemas";
import { StyledDataTable } from "./StyledDataTable";
import { StyledSelect } from "./StyledSelect";
import { StyledSelectMultiple } from "./StyledSelectMultiple";
import { StyledTextField } from "./StyledTextField";

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
				to={`/repositories/${issue.repo_full_name}/issues/${issue.issue_number}`}
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
				to={{
					pathname: `/repositories/${issue.repo_full_name}`,
				}}
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

const getOrderingFn = (
	property: keyof RepoIssueSchema,
) => {
	let orderFn:
		| ((
				a: RepoIssueSchema,
				b: RepoIssueSchema,
		  ) => number)
		| undefined;
	switch (property) {
		case "issue_number":
			orderFn = (a, b) => {
				return orderByNumber(
					a[property] as
						| number
						| undefined
						| null,
					b[property] as
						| number
						| undefined
						| null,
				);
			};
			break;
		case "title":
		case "repo_full_name":
		case "owner_type":
		case "state":
		case "created_at":
		case "updated_at":
			orderFn = (a, b) => {
				return orderByString(
					a[property] as
						| string
						| undefined
						| null,
					b[property] as
						| string
						| undefined
						| null,
				);
			};
	}
	return orderFn;
};

type WrappableListItemProps = {
	children: ReactNode;
	text: string;
};
const WrappableListItem: FC<
	WrappableListItemProps
> = (props) => {
	const { text, children } = props;
	return (
		<ListItem disableGutters>
			<Stack
				width="100%"
				display="flex"
				flexDirection="row"
				flexWrap="wrap"
				alignItems="start"
				justifyContent="space-between"
			>
				<ListItemText
					sx={{
						width: "max(200px, 40%)",
					}}
				>
					{text}
				</ListItemText>
				<Stack
					alignItems="center"
					flexDirection="row"
					minWidth="max(200px, 25%)"
				>
					{children}
				</Stack>
			</Stack>
		</ListItem>
	);
};

type IssueDataTableProps = {
	disableFilter?: boolean;
	orderBy?: keyof RepoIssueSchema;
	issues: RepoIssueSchema[];
	title?: string;
	ownerType?: string;
	repoFullNames?: string[];
	state?: string;
	repoOptions?: GenericSelectOptions<string>[];
};
export const IssueDataTable: React.FC<
	IssueDataTableProps
> = (props) => {
	const {
		orderBy,
		disableFilter,
		repoOptions,
		issues,
		title: title_,
		repoFullNames: repoFullNames_,
		ownerType: ownerType_,
		state: state_,
	} = props;
	const submit = useSubmit();
	const [title, setTitle] = useState(
		title_ ?? "",
	);
	const repoFullNames = repoFullNames_ ?? [];
	const ownerType =
		ownerType_ ?? getIssueFilterPrefOwnerType();
	const state =
		state_ ?? getIssueFilterPrefState();

	const handleSubmit = (
		key: string,
		value: string,
	) => {
		submit(
			{
				title,
				state,
				ownerType,
				repoFullNames,
				[key]: value,
			},
			{ action: "./", method: "get" },
		);
	};
	const handleOwnerTypeChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		handleSubmit("ownerType", value);
	};
	const handleStateChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		handleSubmit("state", value);
	};
	const handleRepoFullNamesChange = (
		event: SelectChangeEvent<string[]>,
	) => {
		const value = event.target.value;
		handleSubmit(
			"repoFullNames",
			value.toString(),
		);
	};
	const handleRepoFullNamesReset = () => {
		handleSubmit("repoFullNames", "");
	};
	const handleTitleSubmit = () => {
		handleSubmit("title", title);
	};

	const [filterOpen, setFilterOpen] =
		useState(false);
	const toggleFilter = () => {
		setFilterOpen(!filterOpen);
	};

	return (
		<Box>
			{!disableFilter && (
				<Fragment>
					<Toolbar
						disableGutters
						variant="dense"
						sx={{
							flexDirection: "row",
							width: "100%",
							flexWrap: "wrap",
							gap: 1,
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<Stack
							alignItems="center"
							direction="row"
						>
							<StyledTextField
								autoComplete="off"
								placeholder="Search issue"
								size="small"
								value={title}
								onChange={setTitle}
								onEnter={handleTitleSubmit}
							/>
							<IconButton
								size="small"
								onClick={toggleFilter}
							>
								<FilterListRounded />
							</IconButton>
						</Stack>
						<Typography>
							Showing {issues.length}{" "}
							{issues.length === 1
								? "issue"
								: "issues"}
						</Typography>
					</Toolbar>
					<Collapse in={filterOpen}>
						<List disablePadding>
							<WrappableListItem text="Repositories">
								<StyledSelectMultiple
									fullWidth
									displayEmpty
									subheader="Repositories"
									renderValue={(value) =>
										`${value.length} selected`
									}
									size="small"
									value={repoFullNames}
									options={repoOptions}
									onChange={
										handleRepoFullNamesChange
									}
								/>
								<IconButton
									size="small"
									onClick={
										handleRepoFullNamesReset
									}
								>
									<ClearRounded />
								</IconButton>
							</WrappableListItem>
							<WrappableListItem text="State">
								<StyledSelect
									fullWidth
									displayEmpty
									size="small"
									value={state}
									options={
										ISSUE_FILTER_STATE_OPTIONS
									}
									onChange={handleStateChange}
								/>
							</WrappableListItem>
							<WrappableListItem text="State">
								<StyledSelect
									fullWidth
									displayEmpty
									size="small"
									value={ownerType}
									options={
										ISSUE_FILTER_OWNER_TYPE_OPTIONS
									}
									onChange={handleOwnerTypeChange}
								/>
							</WrappableListItem>
						</List>
					</Collapse>
				</Fragment>
			)}
			<StyledDataTable
				items={issues}
				columnDefinition={COLUMN_DEFINITION}
				defaultOrderBy={orderBy ?? "updated_at"}
				orderingFn={getOrderingFn}
			/>
		</Box>
	);
};
