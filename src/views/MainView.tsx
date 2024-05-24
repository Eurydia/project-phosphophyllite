import { ListRounded } from "@mui/icons-material";
import {
	AppBar,
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Stack,
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
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";

const NAV_DEFINITION: {
	label: string;
	path: string;
}[] = [
	{
		label: "~",
		path: "//",
	},
	{
		label: "Repositories",
		path: "/repositories",
	},
	{
		label: "Issues",
		path: "/issues",
	},
	{ label: "Settings", path: "/settings" },
];

// const StyledContentBox = styled(Box)(
// 	({ theme }) => ({

// 	}),
// );

type MainViewProps = {
	location: string;
	children: ReactNode;
	// seconadaryAction?: ReactNode;
};
export const MainView: FC<MainViewProps> = (
	props,
) => {
	const { location, children } = props;

	const submit = useSubmit();
	const appBarRef = useRef<HTMLDivElement | null>(
		null,
	);
	const [appBarHeight, setAppBarHeight] =
		useState("0px");
	const [contentHeight, setContentHeight] =
		useState("0vh");
	const [navOpen, setNavOpen] = useState(false);
	const toggleNav = () => {
		setNavOpen(!navOpen);
	};

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
		setAppBarHeight(height);
		setContentHeight(`calc(100svh - ${height})`);
	}, [appBarRef]);

	const navigatePath = (path: string) => {
		submit({}, { action: path, method: "get" });
	};
	const drawerWidth = "250px";
	const contentPadding = navOpen
		? drawerWidth
		: "0px";

	return (
		<Box
			sx={{
				height: "100vh",
				width: "100vw",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<AppBar
				ref={appBarRef}
				elevation={0}
				variant="elevation"
				sx={{
					position: "relative",
					zIndex: ({ zIndex }) =>
						zIndex.drawer + 1,
				}}
			>
				<Toolbar
					disableGutters
					variant="dense"
					sx={{
						width: "100%",
						display: "flex",
						flexWrap: "nowrap",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<IconButton
						disableRipple
						onClick={toggleNav}
					>
						<ListRounded />
					</IconButton>
					<Box
						alignItems="center"
						justifyContent="center"
					>
						<StyledBreadcrumbs path={location} />
					</Box>
					<div />
				</Toolbar>
				<Divider
					flexItem
					variant="fullWidth"
				/>
			</AppBar>
			<Stack direction="row">
				<Drawer
					open={navOpen}
					variant="persistent"
					PaperProps={{
						elevation: 0,
						variant: "outlined",
						sx: {
							paddingTop: appBarHeight,
							width: drawerWidth,
						},
					}}
				>
					<List
						dense
						disablePadding
					>
						{NAV_DEFINITION.map(
							({ label, path }) => (
								<ListItem
									key={label}
									disableGutters
									disablePadding
								>
									<ListItemButton
										onClick={() =>
											navigatePath(path)
										}
									>
										<ListItemText>
											{label}
										</ListItemText>
									</ListItemButton>
								</ListItem>
							),
						)}
					</List>
				</Drawer>
				<Box
					height={contentHeight}
					paddingLeft={contentPadding}
					overflow="auto"
					width="100%"
					sx={{
						transition: ({ transitions }) =>
							`padding-left 0.3s ${transitions.easing.easeInOut}`,
					}}
				>
					{children}
				</Box>
			</Stack>
		</Box>
	);
};
