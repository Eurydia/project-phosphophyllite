import {
	List,
	ListSubheader,
	SelectChangeEvent,
} from "@mui/material";
import { FC, useState } from "react";
import { StyledSelect } from "~components/StyledSelect";
import {
	REPO_FILTER_STATUS_OPTIONS,
	REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS,
	REPO_FILTER_VISIBILITY_OPTIONS,
} from "~constants";
import {
	getRepoFilterPrefStatus,
	getRepoFilterPrefTopicMatchStrategy,
	getRepoFilterPrefVisibility,
	setRepoFilterPrefStatus,
	setRepoFilterPrefTopicMatchStrategy,
	setRepoFilterPrefVisibility,
} from "~database/preferences";
import { WrappableListItem } from "./WrappableListItem";

export const SettingRegionRepoFilterPref: FC =
	() => {
		const [mode, setMode] = useState(
			getRepoFilterPrefTopicMatchStrategy(),
		);
		const [visibility, setVisibility] = useState(
			getRepoFilterPrefVisibility(),
		);
		const [status, setStatus] = useState(
			getRepoFilterPrefStatus(),
		);

		const handleTopicMatchStrategyChange = (
			event: SelectChangeEvent<string>,
		) => {
			const value = event.target.value;
			setRepoFilterPrefTopicMatchStrategy(value);
			setMode(value);
		};
		const handleVisiblityChange = (
			event: SelectChangeEvent<string>,
		) => {
			const value = event.target.value;
			setRepoFilterPrefVisibility(value);
			setVisibility(value);
		};
		const handleStatusChange = (
			event: SelectChangeEvent<string>,
		) => {
			const value = event.target.value;
			setRepoFilterPrefStatus(value);
			setStatus(value);
		};

		return (
			<List
				disablePadding
				subheader={
					<ListSubheader
						disableGutters
						disableSticky
					>
						Repository filter preferences
					</ListSubheader>
				}
			>
				<WrappableListItem primary="Match strategy">
					<StyledSelect
						fullWidth
						displayEmpty
						size="small"
						value={mode}
						options={
							REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS
						}
						onChange={
							handleTopicMatchStrategyChange
						}
					/>
				</WrappableListItem>
				<WrappableListItem primary="Visibility">
					<StyledSelect
						fullWidth
						displayEmpty
						size="small"
						value={visibility}
						options={
							REPO_FILTER_VISIBILITY_OPTIONS
						}
						onChange={handleVisiblityChange}
					/>
				</WrappableListItem>
				<WrappableListItem primary="Status">
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
		);
	};
