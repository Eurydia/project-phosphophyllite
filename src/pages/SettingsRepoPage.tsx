import {
	CircularProgress,
	Stack,
} from "@mui/material";
import { useRepoQueryOptions } from "hooks/useRepoQueryOptions";
import { useRepoQueryPreference } from "hooks/useRepoQueryPreference";
import { FC } from "react";
import { StyledSearchItem } from "~components/StyledSearchItem";
import { StyledSelect } from "~components/StyledSelect";
import { SettingNavView } from "~views/SettingsNavView";

export const SettingsRepoPage: FC = () => {
	const {
		statusOptions,
		topicMatchStrategyOptions,
		visibilityOptions,
	} = useRepoQueryOptions();
	const {
		pref,
		setStatus,
		setTopicMatchStrategy,
		setVisibility,
	} = useRepoQueryPreference();

	if (pref === undefined) {
		return (
			<CircularProgress variant="indeterminate" />
		);
	}

	const {
		status,
		topicMatchStrategy,
		visibility,
	} = pref;

	return (
		<SettingNavView tab={1}>
			<Stack spacing={2}>
				<StyledSearchItem text="Topic match strategy">
					<StyledSelect
						value={topicMatchStrategy}
						options={topicMatchStrategyOptions}
						onChange={setTopicMatchStrategy}
					/>
				</StyledSearchItem>
				<StyledSearchItem text="Visibility">
					<StyledSelect
						value={visibility}
						options={visibilityOptions}
						onChange={setVisibility}
					/>
				</StyledSearchItem>
				<StyledSearchItem text="Status">
					<StyledSelect
						value={status}
						options={statusOptions}
						onChange={setStatus}
					/>
				</StyledSearchItem>
			</Stack>
		</SettingNavView>
	);
};
