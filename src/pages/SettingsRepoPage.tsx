import {
	CircularProgress,
	Stack,
} from "@mui/material";
import { useRepoQueryOptions } from "hooks/useRepoQueryOptions";
import { useRepoQueryPreference } from "hooks/useRepoQueryPreference";
import { FC } from "react";
import { StyledSelect } from "~components/StyledSelect";

export const SettingsRepoPage: FC = () => {
	const { statusOptions, visibilityOptions } =
		useRepoQueryOptions();
	const { pref, setStatus, setVisibility } =
		useRepoQueryPreference();

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
	);
};
