import { Divider, Stack } from "@mui/material";
import { FC } from "react";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { SettingRegionIssueFilterPref } from "./SettingRegions/SettingRegionIssueFilterPref";
import { SettingRegionRepoFilterPref } from "./SettingRegions/SettingRegionRepoFilterPref";
import { SettingRegionSync } from "./SettingRegions/SettingRegionSync";

export const SettingsPage: FC = () => {
	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs
					path="~/settings"
					breadcrumbsProps={{
						sx: { flexGrow: 1 },
					}}
				/>
			}
		>
			<Stack
				padding={2}
				spacing={1}
				divider={<Divider variant="middle" />}
			>
				<SettingRegionRepoFilterPref />
				<SettingRegionIssueFilterPref />
				<SettingRegionSync />
			</Stack>
		</WithAppBar>
	);
};
