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
		title: loadedTitle,
		itemCount,
		repoOptions,
	} = props;

	const submit = useSubmit();
	const [title, setTitle] = useState(loadedTitle);
	const handleSubmit = (
		key: string | undefined = undefined,
		value: string | undefined = undefined,
	) => {
		const query: Record<
			string,
			string | string[]
		> = {
			title,
			state,
			ownerType,
			repoFullNames,
		};
		if (
			key !== undefined &&
			value !== undefined
		) {
			query[key] = value;
		}
		submit(query, {
			action: "./",
			method: "get",
		});
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

	const [filterOpen, setFilterOpen] =
		useState(false);
	const toggleFilter = () => {
		setFilterOpen(!filterOpen);
	};

	let itemCountMsg = `Showing ${itemCount}`;
	if (itemCount === 1) {
		itemCountMsg = `${itemCountMsg} issue`;
	} else {
		itemCountMsg = `${itemCountMsg} issues`;
	}

	let expandIcon = filterOpen ? (
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
						placeholder="Search issue"
						size="small"
						value={title}
						onChange={setTitle}
						onEnter={handleSubmit}
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
					<AdaptiveListItem text="Repositories">
						<StyledSelectMultiple
							fullWidth
							displayEmpty
							renderValue={() =>
								`${repoFullNames.length} selected`
							}
							size="small"
							value={repoFullNames}
							options={repoOptions}
							onChange={handleRepoFullNamesChange}
						/>
						<IconButton
							size="small"
							onClick={handleRepoFullNamesReset}
						>
							<ClearRounded />
						</IconButton>
					</AdaptiveListItem>
					<AdaptiveListItem text="State">
						<StyledSelect
							fullWidth
							displayEmpty
							size="small"
							value={state}
							options={ISSUE_FILTER_STATE_OPTIONS}
							onChange={handleStateChange}
						/>
					</AdaptiveListItem>
					<AdaptiveListItem text="Owner type">
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
					</AdaptiveListItem>
				</List>
			</Collapse>
		</Fragment>
	);
};
