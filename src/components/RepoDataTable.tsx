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
} from "@mui/material";
import {
	REPO_FILTER_STATUS_OPTIONS,
	REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS,
	REPO_FILTER_VISIBILITY_OPTIONS,
} from "constants/REPO_FILTER_OPTIONS";
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
	orderByBoolean,
	orderByString,
} from "~core/sorting";
import { normalizeDateString } from "~core/time";
import {
	getRepoFilterPrefStatus,
	getRepoFilterPrefTopicMatchStrategy,
	getRepoFilterPrefVisibility,
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
				to={`/repositories/${repo.full_name}`}
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
	disableFilter?: boolean;
	orderBy?: keyof RepoSchema;
	repos: RepoSchema[];
	topicOptions?: GenericSelectOptions<string>[];
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
		orderBy,
		disableFilter,
		repos,
		topicOptions: topicOptions_,
		name: name_,
		topicMatchStrategy: topicMatchStrategy_,
		status: status_,
		topics: topics_,
		visibility: visibility_,
	} = props;

	const submit = useSubmit();

	const [name, setName] = useState(name_ || "");
	const topics = topics_ ?? [];
	const topicMatchStrategy =
		topicMatchStrategy_ ||
		getRepoFilterPrefTopicMatchStrategy();
	const visibility =
		visibility_ || getRepoFilterPrefVisibility();
	const status =
		status_ || getRepoFilterPrefStatus();

	const handleSubmit = (
		key: string,
		value: string,
	) => {
		submit(
			{
				name,
				topics,
				topicMatchStrategy,
				visibility,
				status,
				[key]: value,
			},
			{ action: "./", method: "get" },
		);
	};

	const handleNameSubmit = () => {
		handleSubmit("name", name);
	};
	const handleTopicMatchStrategyChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		handleSubmit("topicMatchStrategy", value);
	};
	const handleStatusChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		handleSubmit("status", value);
	};
	const handleVisibilityChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		handleSubmit("visibility", value);
	};
	const handleTopicsChange = (
		event: SelectChangeEvent<string[]>,
	) => {
		const value = event.target.value;
		handleSubmit("topics", value.toString());
	};
	const handleTopicsReset = () => {
		handleSubmit("topics", "value.toString()");
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
								placeholder="Search repository"
								size="small"
								value={name}
								onChange={setName}
								onEnter={handleNameSubmit}
							/>
							<IconButton
								size="small"
								onClick={toggleFilter}
							>
								<FilterListRounded />
							</IconButton>
						</Stack>
						<Typography>
							Showing {repos.length}{" "}
							{repos.length === 1
								? "repository"
								: "repositories"}
						</Typography>
					</Toolbar>
					<Collapse in={filterOpen}>
						<List disablePadding>
							<WrappableListItem text="Topics">
								<StyledSelectMultiple
									fullWidth
									displayEmpty
									subheader="Topics"
									renderValue={(value) =>
										`${value.length} selected`
									}
									size="small"
									value={topics}
									options={topicOptions_}
									onChange={handleTopicsChange}
								/>
								<IconButton
									size="small"
									onClick={handleTopicsReset}
								>
									<ClearRounded />
								</IconButton>
							</WrappableListItem>
							<WrappableListItem text="Topic match strategy">
								<StyledSelect
									fullWidth
									displayEmpty
									size="small"
									value={topicMatchStrategy}
									options={
										REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS
									}
									onChange={
										handleTopicMatchStrategyChange
									}
								/>
							</WrappableListItem>
							<WrappableListItem text="Visibility">
								<StyledSelect
									fullWidth
									displayEmpty
									size="small"
									value={visibility}
									options={
										REPO_FILTER_VISIBILITY_OPTIONS
									}
									onChange={
										handleVisibilityChange
									}
								/>
							</WrappableListItem>
							<WrappableListItem text="Status">
								<StyledSelect
									fullWidth
									displayEmpty
									size="small"
									value={status}
									options={
										REPO_FILTER_STATUS_OPTIONS
									}
									onChange={handleStatusChange}
								/>
							</WrappableListItem>
						</List>
					</Collapse>
				</Fragment>
			)}
			<StyledDataTable
				items={repos}
				orderingFn={getOrderingFn}
				defaultOrderBy={orderBy ?? "pushed_at"}
				columnDefinition={COLUMN_DEFINITION}
			/>
		</Box>
	);
};
