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
	ListSubheader,
	SelectChangeEvent,
	Stack,
	Toolbar,
	Typography,
	capitalize,
} from "@mui/material";
import {
	FC,
	ReactNode,
	useEffect,
	useState,
} from "react";
import { Link } from "react-router-dom";
import {
	ISSUE_FILTER_OWNER_TYPE_OPTIONS,
	ISSUE_FILTER_STATE_OPTIONS,
} from "~constants";
import { filterIssues } from "~core/filtering";
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
		id: "issue_number",
		label: "Issue number",
		render: (issue) => issue.issue_number,
	},
	{
		id: "title",
		label: "Title",
		render: (issue) => (
			<Typography
				component={Link}
				to={{
					pathname: `/repositories/${issue.repo_full_name}/issues/${issue.issue_number}`,
				}}
			>
				{issue.title}
			</Typography>
		),
	},
	{
		id: "repo_full_name",
		label: "Repository",
		render: (issue) => issue.repo_full_name,
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
			normalizeDateString(issue.updated_at),
	},
	{
		id: "created_at",
		label: "Created",
		render: (issue) =>
			normalizeDateString(issue.created_at),
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
	issues: RepoIssueSchema[];
	title?: string;
	ownerType?: string;
	repoFullNames?: string[];
	state?: string;
	repoOptions: GenericSelectOptions<string>[];
};
export const IssueDataTable: React.FC<
	IssueDataTableProps
> = (props) => {
	const {
		repoOptions,
		issues,
		repoFullNames,
		ownerType,
		state,
		title,
	} = props;

	const [filteredIssues, setFilteredIssues] =
		useState(issues);
	const [_title, setTitle] = useState(
		title ?? "",
	);
	const [_repoFullNames, setRepoFullNames] =
		useState(repoFullNames ?? []);
	const [_ownerType, setOwnerType] = useState(
		ownerType ?? getIssueFilterPrefOwnerType(),
	);
	const [_state, setState] = useState(
		state ?? getIssueFilterPrefState(),
	);
	const handleOwnerTypeChange = (
		event: SelectChangeEvent<string>,
	) => {
		setOwnerType(event.target.value);
	};
	const handleStateChange = (
		event: SelectChangeEvent<string>,
	) => {
		setState(event.target.value);
	};
	const handleRepoFullNamesChange = (
		event: SelectChangeEvent<string[]>,
	) => {
		const values = event.target.value
			.toString()
			.normalize()
			.trim()
			.split(",")
			.map((value) => value.trim())
			.filter((value) => value.length > 0);

		setRepoFullNames(values);
	};
	const handleRepoFullNamesReset = () => {
		setRepoFullNames([]);
	};

	useEffect(() => {
		setFilteredIssues(
			filterIssues(
				issues,
				_title,
				_ownerType,
				_repoFullNames,
				_state,
			),
		);
	}, [
		issues,
		_title,
		_ownerType,
		_repoFullNames,
		_state,
	]);

	const [filterOpen, setFilterOpen] =
		useState(false);
	const toggleFilter = () => {
		setFilterOpen(!filterOpen);
	};

	return (
		<Box>
			<Toolbar
				disableGutters
				variant="dense"
			>
				<Stack
					width="100%"
					flexDirection="row"
					flexWrap="wrap"
					gap={1}
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography>
						Showing {filteredIssues.length}{" "}
						{filteredIssues.length === 1
							? "issue"
							: "issues"}
					</Typography>
					<Stack
						alignItems="center"
						direction="row"
					>
						<StyledTextField
							autoComplete="off"
							placeholder="Search issue"
							size="small"
							value={_title}
							onChange={setTitle}
						/>
						<IconButton
							size="small"
							onClick={toggleFilter}
						>
							<FilterListRounded />
						</IconButton>
					</Stack>
				</Stack>
			</Toolbar>
			<Collapse in={filterOpen}>
				<List
					disablePadding
					subheader={
						<ListSubheader
							disableGutters
							disableSticky
						>
							Filter options
						</ListSubheader>
					}
				>
					<WrappableListItem text="Repositories">
						<StyledSelectMultiple
							fullWidth
							displayEmpty
							subheader="Repositories"
							renderValue={(value) =>
								`${value.length} selected`
							}
							size="small"
							value={_repoFullNames}
							options={repoOptions}
							onChange={handleRepoFullNamesChange}
						/>
						<IconButton
							size="small"
							onClick={handleRepoFullNamesReset}
						>
							<ClearRounded />
						</IconButton>
					</WrappableListItem>
					<WrappableListItem text="State">
						<StyledSelect
							fullWidth
							displayEmpty
							subheader="State"
							size="small"
							value={_state}
							options={ISSUE_FILTER_STATE_OPTIONS}
							onChange={handleStateChange}
						/>
					</WrappableListItem>
					<WrappableListItem text="State">
						<StyledSelect
							fullWidth
							displayEmpty
							subheader="Type"
							size="small"
							value={_ownerType}
							options={
								ISSUE_FILTER_OWNER_TYPE_OPTIONS
							}
							onChange={handleOwnerTypeChange}
						/>
					</WrappableListItem>
				</List>
			</Collapse>
			<StyledDataTable
				items={filteredIssues}
				columnDefinition={COLUMN_DEFINITION}
				defaultOrderBy="updated_at"
				orderingFn={getOrderingFn}
			/>
		</Box>
	);
};
