import {
	ClearRounded,
	ExpandLessRounded,
	ExpandMoreRounded,
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
	getRepoFilterPrefPropertyPrefix,
	getRepoFilterPrefStatus,
	getRepoFilterPrefTopicMatchStrategy,
	getRepoFilterPrefVisibility,
} from "~database/preferences";
import { GenericSelectOption } from "~types/generics";
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

type StyledToolbarProps = {
	name: string;
	topics: string[];
	visibility: string;
	status: string;
	topicMatchStrategy: string;
	itemCount: number;
	topicOptions: GenericSelectOption<string>[];
	properties: string[];
	propertyOptions: GenericSelectOption<string>[];
};
const StyledToolbar: FC<StyledToolbarProps> = (
	props,
) => {
	const {
		name: loadedName,
		status,
		topics,
		visibility,
		topicMatchStrategy,
		itemCount,
		topicOptions,
		propertyOptions,
		properties,
	} = props;

	const submit = useSubmit();

	const [name, setName] = useState(loadedName);
	const handleSubmit = (
		key: string | undefined = undefined,
		value: string | undefined = undefined,
	) => {
		const query: Record<
			string,
			string | string[]
		> = {
			name,
			topics,
			topicMatchStrategy,
			visibility,
			status,
			properties,
		};
		if (
			key !== undefined &&
			value !== undefined
		) {
			query[key] = value;
		}
		submit(query, {
			action: "/",
			method: "get",
		});
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
	const handleTopicChange = (
		event: SelectChangeEvent<string[]>,
	) => {
		const value = event.target.value.toString();
		handleSubmit("topics", value);
	};
	const handleTopicClear = () => {
		handleSubmit("topics", "");
	};
	const handlePropertyChange = (
		event: SelectChangeEvent<string[]>,
	) => {
		const value = event.target.value.toString();
		handleSubmit("properties", value);
	};
	const handlePropertyClear = () => {
		handleSubmit("properties", "");
	};

	const [filterOpen, setFilterOpen] =
		useState(false);
	const toggleFilter = () => {
		setFilterOpen(!filterOpen);
	};

	let itemCountMsg = `Showing ${itemCount}`;
	if (itemCount === 1) {
		itemCountMsg = `${itemCountMsg} repository`;
	} else {
		itemCountMsg = `${itemCountMsg} repositories`;
	}

	const expandIcon = filterOpen ? (
		<ExpandLessRounded />
	) : (
		<ExpandMoreRounded />
	);

	return (
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
						onClick={() => handleSubmit()}
					>
						<FilterListRounded />
					</IconButton>
					<IconButton
						size="small"
						onClick={toggleFilter}
					>
						{expandIcon}
					</IconButton>
				</Stack>
				<Typography>{itemCountMsg}</Typography>
			</Toolbar>
			<Collapse in={filterOpen}>
				<List disablePadding>
					<WrappableListItem text="Properties">
						<StyledSelectMultiple
							fullWidth
							displayEmpty
							renderValue={() =>
								`${properties.length} selected`
							}
							size="small"
							value={properties}
							options={propertyOptions}
							onChange={handlePropertyChange}
						/>
						<IconButton
							size="small"
							onClick={handlePropertyClear}
						>
							<ClearRounded />
						</IconButton>
					</WrappableListItem>
					<WrappableListItem text="Topics">
						<StyledSelectMultiple
							fullWidth
							displayEmpty
							renderValue={() =>
								`${topics.length} selected`
							}
							size="small"
							value={topics}
							options={topicOptions}
							onChange={handleTopicChange}
						/>
						<IconButton
							size="small"
							onClick={handleTopicClear}
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
							onChange={handleVisibilityChange}
						/>
					</WrappableListItem>
					<WrappableListItem text="Status">
						<StyledSelect
							fullWidth
							displayEmpty
							size="small"
							value={status}
							options={REPO_FILTER_STATUS_OPTIONS}
							onChange={handleStatusChange}
						/>
					</WrappableListItem>
				</List>
			</Collapse>
		</Fragment>
	);
};

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
				orderingFn={getOrderingFn}
				defaultOrderBy={orderBy ?? "pushed_at"}
				columnDefinition={COLUMN_DEFINITION}
			/>
		</Box>
	);
};
