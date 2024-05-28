import {
	AppBar,
	Box,
	Divider,
	Toolbar,
} from "@mui/material";
import {
	FC,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { AppHeader } from "~components/AppHeader";

type MainViewProps = {
	children: ReactNode;
	nav: ReactNode;
};
export const AppHeaderView: FC<MainViewProps> = (
	props,
) => {
	const { children, nav } = props;

	// const submit = useSubmit();
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

	return (
		<Box>
			<AppBar
				elevation={0}
				ref={appBarRef}
				position="relative"
			>
				<Toolbar
					disableGutters
					variant="dense"
				>
					<AppHeader />
				</Toolbar>
				<Divider
					flexItem
					variant="fullWidth"
				/>
				<Toolbar
					disableGutters
					variant="dense"
				>
					{nav}
				</Toolbar>
				<Divider
					flexItem
					variant="fullWidth"
				/>
			</AppBar>
			<Box
				width="100%"
				overflow="auto"
				height={contentHeight}
			>
				{children}
			</Box>
		</Box>
	);
};
