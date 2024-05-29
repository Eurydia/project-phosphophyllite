import {
	ChevronLeftRounded,
	ChevronRightRounded,
	SettingsRounded,
} from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { FC } from "react";
import {
	useLocation,
	useNavigate,
} from "react-router";
import { useSubmit } from "react-router-dom";
import { StyledBreadcrumbs } from "./StyledBreadcrumbs";
import { StyledIconButton } from "./StyledIconButton";

export const AppHeader: FC = () => {
	const submit = useSubmit();
	const navigator = useNavigate();
	const { pathname } = useLocation();

	const goBackward = () => {
		navigator(-1);
	};
	const goForward = () => {
		navigator(1);
	};
	const goSettings = () => {
		submit(
			{},
			{ action: "/Settings", method: "get" },
		);
	};

	const appState = window.history.state as {
		idx: number;
	};
	const firstInStack = appState.idx === 0;
	const historyLength = window.history.length;
	const lastInStack =
		appState.idx === historyLength - 1;

	const appPath = "~" + pathname;

	return (
		<Stack
			width="100%"
			direction="row"
			alignItems="center"
			justifyContent="space-between"
		>
			<Stack direction="row">
				<StyledIconButton
					onClick={goBackward}
					disabled={firstInStack}
				>
					<ChevronLeftRounded />
				</StyledIconButton>
				<StyledIconButton
					onClick={goForward}
					disabled={lastInStack}
				>
					<ChevronRightRounded />
				</StyledIconButton>
			</Stack>
			<Box overflow="hidden">
				<StyledBreadcrumbs path={appPath} />
			</Box>
			<StyledIconButton onClick={goSettings}>
				<SettingsRounded />
			</StyledIconButton>
		</Stack>
	);
};
