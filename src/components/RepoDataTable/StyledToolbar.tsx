import {
	ExpandLessRounded,
	ExpandMoreRounded,
	FilterListRounded,
} from "@mui/icons-material";
import {
	Box,
	Collapse,
	List,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { Form } from "react-router-dom";
import { AdaptiveListItem } from "~components/AdaptiveListItem";
import { StyledIconButton } from "~components/StyledIconButton";
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
	itemCount: number;
	name: string;
	topics: string[];
	visibility: string;
	status: string;
	topicMatchStrategy: string;
	topicOptions: GenericSelectOption<string>[];
	properties: string[];
	propertyOptions: GenericSelectOption<string>[];
};
export const StyledToolbar: FC<
	StyledToolbarProps
> = (props) => {
	const {
		itemCount,
		name,
		status,
		topics,
		visibility,
		topicMatchStrategy,
		topicOptions,
		propertyOptions,
		properties,
	} = props;

	const [filterOpen, setFilterOpen] =
		useState(false);
	const toggleFilter = () => {
		setFilterOpen(!filterOpen);
	};

	const renderPropepertySelectValue = () =>
		`${properties.length} selected`;
	const renderTopicSelectValue = () =>
		`${topics.length} selected`;
	const expandIcon = filterOpen ? (
		<ExpandLessRounded />
	) : (
		<ExpandMoreRounded />
	);
	const itemCountMsg =
		itemCount === 1
			? `Showing ${itemCount} repository`
			: `Showing ${itemCount} repositories`;

	return (
		<Form>
			<Toolbar
				disableGutters
				variant="dense"
			>
				<Box
					gap={2}
					width="100%"
					display="flex"
					flexWrap="wrap"
					flexDirection="row"
					alignItems="center"
				>
					<Stack
						flexGrow={1}
						direction="row"
						alignItems="center"
					>
						<StyledTextField
							name="name"
							type="text"
							autoComplete="off"
							placeholder="Search repository"
							defaultValue={name}
						/>
						<StyledIconButton submit>
							<FilterListRounded />
						</StyledIconButton>
						<StyledIconButton
							onClick={toggleFilter}
						>
							{expandIcon}
						</StyledIconButton>
					</Stack>
					<Typography>{itemCountMsg}</Typography>
				</Box>
			</Toolbar>
			<Collapse in={filterOpen}>
				<List disablePadding>
					<AdaptiveListItem text="Properties">
						<StyledSelectMultiple
							name="properties"
							defaultValue={properties}
							options={propertyOptions}
							renderValue={
								renderPropepertySelectValue
							}
						/>
					</AdaptiveListItem>
					<AdaptiveListItem text="Topics">
						<StyledSelectMultiple
							name="topics"
							defaultValue={topics}
							options={topicOptions}
							renderValue={renderTopicSelectValue}
						/>
					</AdaptiveListItem>
					<AdaptiveListItem text="Topic match strategy">
						<StyledSelect
							name="topicMatchStrategy"
							defaultValue={topicMatchStrategy}
							options={
								REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS
							}
						/>
					</AdaptiveListItem>
					<AdaptiveListItem text="Visibility">
						<StyledSelect
							name="visibility"
							defaultValue={visibility}
							options={
								REPO_FILTER_VISIBILITY_OPTIONS
							}
						/>
					</AdaptiveListItem>
					<AdaptiveListItem text="Status">
						<StyledSelect
							name="status"
							defaultValue={status}
							options={REPO_FILTER_STATUS_OPTIONS}
						/>
					</AdaptiveListItem>
				</List>
			</Collapse>
		</Form>
	);
};
