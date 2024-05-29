import {
	CircularProgress,
	Stack,
} from "@mui/material";
import { useIssueQueryOptions } from "hooks/useIssueQueryOptions";
import { useIssueQueryPreference } from "hooks/useIssueQueryPreference";
import { FC } from "react";
import { StyledSearchItem } from "~components/StyledSearchItem";
import { StyledSelect } from "~components/StyledSelect";
import { SettingNavView } from "~views/SettingsNavView";

export const SettingsIssuePage: FC = () => {
	const { ownerTypeOptions, stateOptions } =
		useIssueQueryOptions();
	const { pref, setOwnerType, setState } =
		useIssueQueryPreference();

	if (pref === undefined) {
		return (
			<CircularProgress variant="indeterminate" />
		);
	}
	const { ownerType, state } = pref;
	return (
		<SettingNavView tab={2}>
			<Stack spacing={2}>
				<StyledSearchItem text="State">
					<StyledSelect
						value={state}
						options={stateOptions}
						onChange={setState}
					/>
				</StyledSearchItem>
				<StyledSearchItem text="Owner type">
					<StyledSelect
						value={ownerType}
						options={ownerTypeOptions}
						onChange={setOwnerType}
					/>
				</StyledSearchItem>
			</Stack>
		</SettingNavView>
	);
};
