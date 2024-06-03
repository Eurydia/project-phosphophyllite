import {
	Box,
	Divider,
	Stack,
} from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "~components/AppHeader";

export const SettingGroupView: FC = () => {
	return (
		<Stack>
			<AppHeader />
			<Divider flexItem />
			<Box padding={2}>
				<Outlet />
			</Box>
		</Stack>
	);
};
