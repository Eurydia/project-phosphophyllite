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
	ISSUE_FILTER_OWNER_TYPE_OPTIONS,
	ISSUE_FILTER_STATE_OPTIONS,
} from "~constants";
import { GenericSelectOption } from "~types/generics";

type StyledToolbarProps = {
	title: string;
	repoFullNames: string[];
	ownerType: string;
	state: string;
	itemCount: number;
	repoOptions: GenericSelectOption<string>[];
};
export const StyledToolbar: FC<
	StyledToolbarProps
> = (props) => {
	const {
		ownerType,
		repoFullNames,
		state,
		title,
		itemCount,
		repoOptions,
	} = props;

	const [filterOpen, setFilterOpen] =
		useState(false);
	const toggleFilter = () => {
		setFilterOpen(!filterOpen);
	};

	const renderRepoSelectValue = () => {
		return `${repoFullNames.length} selected`;
	};

	const itemCountMsg =
		itemCount === 1
			? `Showing ${itemCount} issue`
			: `Showing ${itemCount} issues`;

	let expandIcon = filterOpen ? (
		<ExpandLessRounded />
	) : (
		<ExpandMoreRounded />
	);

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
							name="title"
							placeholder="Search issue"
							defaultValue={title}
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
					<AdaptiveListItem text="Repositories">
						<StyledSelectMultiple
							name="repoFullNames"
							options={repoOptions}
							autoComplete="off"
							defaultValue={repoFullNames}
							renderValue={renderRepoSelectValue}
						/>
					</AdaptiveListItem>
					<AdaptiveListItem text="State">
						<StyledSelect
							name="state"
							defaultValue={state}
							options={ISSUE_FILTER_STATE_OPTIONS}
						/>
					</AdaptiveListItem>
					<AdaptiveListItem text="Owner type">
						<StyledSelect
							name="ownerType"
							defaultValue={ownerType}
							options={
								ISSUE_FILTER_OWNER_TYPE_OPTIONS
							}
						/>
					</AdaptiveListItem>
				</List>
			</Collapse>
		</Form>
	);
};
