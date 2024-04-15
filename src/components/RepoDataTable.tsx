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
} from "@mui/material";
import {
	REPO_FILTER_STATUS_OPTIONS,
	REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS,
	REPO_FILTER_VISIBILITY_OPTIONS,
} from "constants/REPO_FILTER_OPTIONS";
import {
	FC,
	ReactNode,
	useEffect,
	useState,
} from "react";
import { Link } from "react-router-dom";
import { filterRepos } from "~core/filtering";
import {
	orderByBoolean,
	orderByString,
} from "~core/sorting";
import { normalizeDateString } from "~core/time";
import {
	getIssueFilterPrefState,
	getRepoFilterPrefStatus,
	getRepoFilterPrefTopicMatchStrategy,
} from "~database/preferences";
import { GenericSelectOptions } from "~types/generics";
import { RepoSchema } from "~types/schemas";
import { StyledDataTable } from "./StyledDataTable";
import { StyledSelect } from "./StyledSelect";
import { StyledSelectMultiple } from "./StyledSelectMultiple";
import { StyledTextField } from "./StyledTextField";

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
				to={`./${repo.full_name}`}
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
			normalizeDateString(repo.pushed_at),
	},
	{
		id: "updated_at",
		label: "Last updated",
		render: (repo) =>
			normalizeDateString(repo.updated_at),
	},
	{
		id: "created_at",
		label: "Created",
		render: (repo) =>
			normalizeDateString(repo.created_at),
	},
];

const getOrderingFn = (
	property: keyof RepoSchema,
):
	| ((a: RepoSchema, b: RepoSchema) => number)
	| undefined => {
	switch (property) {
		case "is_archived":
		case "is_private":
			return (a, b) =>
				orderByBoolean(
					a[property] as
						| boolean
						| undefined
						| null,
					b[property] as
						| boolean
						| undefined
						| null,
				);
		case "full_name":
		case "pushed_at":
		case "created_at":
		case "updated_at":
			return (a, b) =>
				orderByString(
					a[property] as
						| string
						| undefined
						| null,
					b[property] as
						| string
						| undefined
						| null,
				);
	}
	return undefined;
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

type RepoDataTableProps = {
	repos: RepoSchema[];
	topicOptions: GenericSelectOptions<string>[];
	name?: string;
	topics?: string[];
	topicMatchStrategy?: string;
	visibility?: string;
	status?: string;
};
export const RepoDataTable: React.FC<
	RepoDataTableProps
> = (props) => {
	const {
		repos,
		topicOptions,
		name,
		topicMatchStrategy,
		status,
		topics,
		visibility,
	} = props;

	const [filteredRepos, setFilteredRepos] =
		useState(repos);
	const [_name, setFilterName] = useState(
		name || "",
	);
	const [_topics, setFilterTopics] = useState(
		topics ?? [],
	);
	const [
		_topicMatchStrategy,
		setFilterTopicMatchStrategy,
	] = useState(
		topicMatchStrategy ||
			getRepoFilterPrefTopicMatchStrategy(),
	);
	const [_visibility, setFilterVisibility] =
		useState(
			visibility || getIssueFilterPrefState(),
		);
	const [_status, setFilterStatus] = useState(
		status || getRepoFilterPrefStatus(),
	);

	const handleFilterStrategyChange = (
		event: SelectChangeEvent<string>,
	) => {
		setFilterTopicMatchStrategy(
			event.target.value,
		);
	};
	const handleFilterStatusChange = (
		event: SelectChangeEvent<string>,
	) => {
		setFilterStatus(event.target.value);
	};
	const handleFilterVisibilityChange = (
		event: SelectChangeEvent<string>,
	) => {
		setFilterVisibility(event.target.value);
	};
	const handleFilterTopicChange = (
		event: SelectChangeEvent<string[]>,
	) => {
		const value = event.target.value
			.toString()
			.normalize();
		setFilterTopics(
			value
				.split(",")
				.filter((value_) => Boolean(value_)),
		);
	};
	const handleResetFilterTopic = () => {
		setFilterTopics([]);
	};

	useEffect(() => {
		setFilteredRepos(
			filterRepos(
				repos,
				_name,
				_topics,
				_visibility,
				_status,
				_topicMatchStrategy,
			),
		);
	}, [
		repos,
		_name,
		_topics,
		_status,
		_visibility,
		_topicMatchStrategy,
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
						Showing {filteredRepos.length}{" "}
						{filteredRepos.length === 1
							? "repository"
							: "repositories"}
					</Typography>
					<Stack
						alignItems="center"
						direction="row"
					>
						<StyledTextField
							autoComplete="off"
							placeholder="Search repository"
							size="small"
							value={_name}
							onChange={setFilterName}
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
					<WrappableListItem text="Topics">
						<StyledSelectMultiple
							fullWidth
							displayEmpty
							subheader="Topics"
							renderValue={(value) =>
								`${value.length} selected`
							}
							size="small"
							value={_topics}
							options={topicOptions}
							onChange={handleFilterTopicChange}
						/>
						<IconButton
							size="small"
							onClick={handleResetFilterTopic}
						>
							<ClearRounded />
						</IconButton>
					</WrappableListItem>
					<WrappableListItem text="Topic match strategy">
						<StyledSelect
							fullWidth
							displayEmpty
							subheader="Match strategy"
							size="small"
							value={_topicMatchStrategy}
							options={
								REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS
							}
							onChange={
								handleFilterStrategyChange
							}
						/>
					</WrappableListItem>
					<WrappableListItem text="Visibility">
						<StyledSelect
							fullWidth
							displayEmpty
							subheader="Visibility"
							size="small"
							value={_visibility}
							options={
								REPO_FILTER_VISIBILITY_OPTIONS
							}
							onChange={
								handleFilterVisibilityChange
							}
						/>
					</WrappableListItem>
					<WrappableListItem text="Status">
						<StyledSelect
							fullWidth
							displayEmpty
							subheader="Status"
							size="small"
							value={_status}
							options={REPO_FILTER_STATUS_OPTIONS}
							onChange={handleFilterStatusChange}
						/>
					</WrappableListItem>
				</List>
			</Collapse>
			<StyledDataTable
				items={filteredRepos}
				orderingFn={getOrderingFn}
				defaultOrderBy="pushed_at"
				columnDefinition={COLUMN_DEFINITION}
			/>
		</Box>
	);
};
