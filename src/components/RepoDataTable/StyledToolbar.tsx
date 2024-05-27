import {
	ClearRounded,
	ExpandLessRounded,
	ExpandMoreRounded,
	FilterListRounded,
} from "@mui/icons-material";
import {
	Collapse,
	IconButton,
	List,
	SelectChangeEvent,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useSubmit } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { AdaptiveListItem } from "~components/AdaptiveListItem";
import { StyledSelect } from "~components/StyledSelect";
import { StyledSelectMultiple } from "~components/StyledSelectMultiple";
import { StyledTextField } from "~components/StyledTextField";
import {
	REPO_FILTER_STATUS_OPTIONS,
	REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS,
	REPO_FILTER_VISIBILITY_OPTIONS,
} from "~constants";
import { GenericSelectOption } from "~types/generics";

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
export const StyledToolbar: FC<
	StyledToolbarProps
> = (props) => {
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

	let itemCountMsg =
		itemCount === 1
			? `Showing ${itemCount} repository`
			: `Showing ${itemCount} repositories`;

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
					display: "flex",
					flexDirection: "row",
					width: "100%",
					flexWrap: "wrap",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<Stack
					direction="row"
					width="100%"
				>
					<StyledTextField
						fullWidth
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
					<AdaptiveListItem text="Properties">
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
					</AdaptiveListItem>
					<AdaptiveListItem text="Topics">
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
					</AdaptiveListItem>
					<AdaptiveListItem text="Topic match strategy">
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
					</AdaptiveListItem>
					<AdaptiveListItem text="Visibility">
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
					</AdaptiveListItem>
					<AdaptiveListItem text="Status">
						<StyledSelect
							fullWidth
							displayEmpty
							size="small"
							value={status}
							options={REPO_FILTER_STATUS_OPTIONS}
							onChange={handleStatusChange}
						/>
					</AdaptiveListItem>
				</List>
			</Collapse>
		</Fragment>
	);
};
