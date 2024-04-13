import {
	AppBar,
	Box,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Paper,
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

type WithAppBarProps = {
	location: ReactNode;
	children: ReactNode;
	seconadaryAction?: ReactNode;
};
export const WithAppBar: FC<WithAppBarProps> = (
	props,
) => {
	const { location, children, seconadaryAction } =
		props;
	const submit = useSubmit();
	const appBarRef = useRef<HTMLElement | null>(
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
		const appBarHeight =
			appBarRef.current.getBoundingClientRect()
				.height;

		setContentHeight(
			`calc(100vh - ${appBarHeight}px)`,
		);
	}, [appBarRef]);

	const redirectHome = () => {
		submit({}, { action: "/", method: "get" });
	};

	return (
		<Grid
			container
			columns={10}
			maxWidth="100vw"
		>
			<Grid
				item
				xs={2}
			>
				<Paper
					square
					variant="outlined"
					sx={{ height: "100%" }}
				>
					<Toolbar variant="dense" />
					<Divider />
					<List
						disablePadding
						dense
					>
						<ListItem disableGutters>
							<ListItemButton
								onClick={redirectHome}
							>
								<ListItemText>Home</ListItemText>
							</ListItemButton>
						</ListItem>
					</List>
				</Paper>
			</Grid>
			<Grid
				item
				xs={8}
			>
				<AppBar
					ref={appBarRef}
					position="relative"
					elevation={0}
					variant="outlined"
				>
					<Toolbar
						variant="dense"
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						{location}
						{seconadaryAction}
					</Toolbar>
				</AppBar>
				<Box
					height={contentHeight}
					overflow="auto"
				>
					{children}
				</Box>
			</Grid>
		</Grid>
	);
};
