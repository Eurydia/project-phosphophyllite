import { SettingsRounded } from "@mui/icons-material";
import {
	Box,
	IconButton,
	Toolbar,
} from "@mui/material";
import {
	FC,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { useSubmit } from "react-router-dom";
import { AppHeader } from "~components/AppHeader";
import { StyledAppBar } from "~components/StyledAppBar";

type MainViewProps = {
	children: ReactNode;
};
export const MainView: FC<MainViewProps> = (
	props,
) => {
	const { children } = props;

	const submit = useSubmit();
	const appBarRef = useRef<HTMLDivElement | null>(
		null,
	);
	const [contentHeight, setContentHeight] =
		useState("0vh");
	useEffect(() => {
		if (
			appBarRef === null ||
			appBarRef.current === null
		) {
			return;
		}
		const height =
			appBarRef.current.getBoundingClientRect()
				.height + "px";
		setContentHeight(`calc(100svh - ${height})`);
	}, [appBarRef]);

	const toSettings = () => {
		submit(
			{},
			{ action: "/Settings", method: "get" },
		);
	};

	return (
		<Box>
			<StyledAppBar
				ref={appBarRef}
				variant="outlined"
			>
				<Toolbar
					disableGutters
					variant="dense"
				>
					<AppHeader />
					<IconButton
						color="inherit"
						size="small"
						onClick={toSettings}
					>
						<SettingsRounded fontSize="small" />
					</IconButton>
				</Toolbar>
			</StyledAppBar>
			<Box
				height={contentHeight}
				width="100%"
			>
				{children}
			</Box>
		</Box>
	);
};
