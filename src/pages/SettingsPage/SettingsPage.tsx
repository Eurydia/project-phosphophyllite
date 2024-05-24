import { Divider, Stack } from "@mui/material";
import { FC } from "react";
import { MainView } from "~views/MainView";
import { SettingRegionIssueFilterPref } from "./SettingRegions/SettingRegionIssueFilterPref";
import { SettingRegionRepoFilterPref } from "./SettingRegions/SettingRegionRepoFilterPref";
import { SettingRegionSync } from "./SettingRegions/SettingRegionSync";

export const SettingsPage: FC = () => {
	return (
		<MainView location="~/Settings">
			<Stack
				padding={2}
				spacing={1}
				divider={<Divider variant="middle" />}
			>
				<SettingRegionRepoFilterPref />
				<SettingRegionIssueFilterPref />
				<SettingRegionSync />
			</Stack>
		</MainView>
	);
};
