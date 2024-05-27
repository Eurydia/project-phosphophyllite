import {
	List,
	ListSubheader,
	SelectChangeEvent,
} from "@mui/material";
import { FC, useState } from "react";
import {
	getRepoFilterPrefPropertyPrefix,
	getRepoFilterPrefStatus,
	getRepoFilterPrefTopicMatchStrategy,
	getRepoFilterPrefVisibility,
	setRepoFilterPrefCustomPrefix,
	setRepoFilterPrefStatus,
	setRepoFilterPrefTopicMatchStrategy,
	setRepoFilterPrefVisibility,
} from "~database/preferences";

const DEF_MODE =
	getRepoFilterPrefTopicMatchStrategy();
const DEF_VIS = getRepoFilterPrefVisibility();
const DEF_PREFIX =
	getRepoFilterPrefPropertyPrefix();
const DEF_STATUS = getRepoFilterPrefStatus();
export const SettingRegionRepoFilterPref: FC =
	() => {
		const [customPrefix, setCustomPrefix] =
			useState(DEF_PREFIX);
		const [mode, setMode] = useState(DEF_MODE);
		const [visibility, setVisibility] =
			useState(DEF_VIS);
		const [status, setStatus] =
			useState(DEF_STATUS);

		const handleCustomPrefixChange = (
			value: string,
		) => {
			setRepoFilterPrefCustomPrefix(value);
			setCustomPrefix(value);
		};
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
				{/* <WrappableListItem
					primary="Prefix"
					secondary="Topics start with the prefix are treated as special properties."
				>
					<StyledTextField
						fullWidth
						placeholder="phospho-"
						size="small"
						value={customPrefix}
						onChange={handleCustomPrefixChange}
					/>
				</WrappableListItem>
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
				</WrappableListItem> */}
			</List>
		);
	};
