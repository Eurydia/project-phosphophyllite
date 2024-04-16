import { Divider, Stack } from "@mui/material";
import { FC } from "react";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { SettingRegionAPI } from "./SettingRegions/SettingRegionAPI";
import { SettingRegionRepoFilterPref } from "./SettingRegions/SettingRegionRepoFilterPref";
import { SettingRegionSync } from "./SettingRegions/SettingRegionSync";
import { SettingRegionIssueFilterPref } from "./SettingRegions/SettingRegionIssueFilterPref";

export const SettingsPage: FC = () => {
	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs paths="~/settings" />
			}
		>
			<Stack
				paddingTop={2}
				paddingX={2}
				spacing={1}
				divider={<Divider variant="middle" />}
			>
				<SettingRegionRepoFilterPref />
				<SettingRegionIssueFilterPref />
				<SettingRegionAPI />
				<SettingRegionSync />
			</Stack>
		</WithAppBar>
	);
};
