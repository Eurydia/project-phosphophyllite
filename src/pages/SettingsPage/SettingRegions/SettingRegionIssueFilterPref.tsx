import {
	List,
	ListSubheader,
	SelectChangeEvent,
} from "@mui/material";
import { FC, useState } from "react";
import { StyledSelect } from "~components/StyledSelect";
import {
	ISSUE_FILTER_OWNER_TYPE_OPTIONS,
	ISSUE_FILTER_STATE_OPTIONS,
} from "~constants";
import {
	getIssueFilterPrefOwnerType,
	getIssueFilterPrefState,
	setIssueFilterPrefOwnerType,
	setIssueFilterPrefState,
} from "~database/preferences";
import { WrappableListItem } from "./WrappableListItem";

export const SettingRegionIssueFilterPref: FC =
	() => {
		const [ownerType, setOwnerType] = useState(
			getIssueFilterPrefOwnerType(),
		);
		const [state, setState] = useState(
			getIssueFilterPrefState(),
		);

		const handleOwnerTypeChange = (
			event: SelectChangeEvent<string>,
		) => {
			const value = event.target.value;
			setIssueFilterPrefOwnerType(value);
			setOwnerType(value);
		};
		const handleStateChange = (
			event: SelectChangeEvent<string>,
		) => {
			const value = event.target.value;
			setIssueFilterPrefState(value);
			setState(value);
		};

		return (
			<List
				disablePadding
				subheader={
					<ListSubheader
						disableGutters
						disableSticky
					>
						Issue filter preferences
					</ListSubheader>
				}
			>
				<WrappableListItem primary="Owner type">
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
				<WrappableListItem primary="State">
					<StyledSelect
						fullWidth
						displayEmpty
						size="small"
						value={state}
						options={ISSUE_FILTER_STATE_OPTIONS}
						onChange={handleStateChange}
					/>
				</WrappableListItem>
			</List>
		);
	};
