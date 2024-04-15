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

	const redirectPath = (path: string) => {
		submit({}, { action: path, method: "get" });
	};

	return (
		<Grid
			container
			columns={10}
			maxWidth="100vw"
		>
			<Grid
				item
				xs={3}
				md={2}
			>
				<Paper
					square
					variant="outlined"
					elevation={0}
					sx={{
						height: "100%",
						borderTopWidth: 0,
						borderLeftWidth: 0,
						borderBottomWidth: 0,
					}}
				>
					<Toolbar variant="dense" />
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
									onClick={() =>
										redirectPath(path)
									}
								>
									<ListItemText>
										{label}
									</ListItemText>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Paper>
			</Grid>
			<Grid
				item
				xs={7}
				md={8}
			>
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
							flexWrap: "wrap",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
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
			</Grid>
		</Grid>
	);
};
