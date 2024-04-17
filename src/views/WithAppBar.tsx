import {
	CloseRounded,
	ListRounded,
} from "@mui/icons-material";
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
	Toolbar,
	Typography,
} from "@mui/material";
import {
	FC,
	Fragment,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { useSubmit } from "react-router-dom";

const nav: { label: string; path: string }[] = [
	{ label: "~", path: "/" },
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
	const [drawerOpen, setDrawerOpen] =
		useState(false);
	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
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
			`calc(100svh - ${appBarHeight}px)`,
		);
	}, [appBarRef]);

	const redirectPath = (path: string) => {
		submit({}, { action: path, method: "get" });
	};

	return (
		<Fragment>
			<Box maxWidth="100vw">
				<AppBar
					ref={appBarRef}
					position="relative"
					variant="elevation"
					elevation={0}
				>
					<Toolbar
						variant="dense"
						sx={{
							display: "flex",
							flexDirection: "row",
							flexWrap: "nowrap",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<IconButton
							size="small"
							onClick={toggleDrawer}
							sx={{ flexGrow: 0 }}
						>
							<ListRounded />
						</IconButton>
						{location}
						{seconadaryAction}
					</Toolbar>
					<Divider
						flexItem
						variant="fullWidth"
					/>
				</AppBar>
				<Box
					height={contentHeight}
					overflow="auto"
				>
					{children}
				</Box>
			</Box>
			<Drawer
				open={drawerOpen}
				onClose={toggleDrawer}
				PaperProps={{
					square: true,
					variant: "outlined",
					elevation: 0,
					sx: {
						width: 240,
						height: "100%",
						borderTopWidth: 0,
						borderLeftWidth: 0,
						borderBottomWidth: 0,
					},
				}}
			>
				<Toolbar
					variant="dense"
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<IconButton
						size="small"
						onClick={toggleDrawer}
					>
						<CloseRounded />
					</IconButton>
					<Typography fontWeight="bold">
						Navigation
					</Typography>
				</Toolbar>
				<Divider />
				<List
					disablePadding
					dense
					sx={{
						wordBreak: "break-word",
						whiteSpace: "wrap",
					}}
				>
					{nav.map(({ label, path }) => (
						<ListItem
							disableGutters
							key={path}
						>
							<ListItemButton
								onClick={() => redirectPath(path)}
							>
								<ListItemText>
									{label}
								</ListItemText>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
		</Fragment>
	);
};
