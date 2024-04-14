import {
	ChevronLeftRounded,
	ClearRounded,
} from "@mui/icons-material";
import {
	Container,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Stack,
	Tab,
	Tabs,
	Toolbar,
	Typography,
} from "@mui/material";
import { Buffer } from "buffer";
import { FC, useState } from "react";
import { useLoaderData } from "react-router";
import { Markdown } from "~components/Markdown";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { toDetails } from "./helper";
import { LoaderData } from "./loader";

export const RepoDetailsPage: FC = () => {
	const loaderData =
		useLoaderData() as LoaderData;

	const [tab, setTab] = useState(0);
	const [drawerOpen, setDrawerOpen] =
		useState(false);

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
	const closeDrawer = () => {
		setDrawerOpen(false);
	};

	let decodedReadme: string | undefined;
	if (loaderData.repo.readme !== undefined) {
		decodedReadme = Buffer.from(
			loaderData.repo.readme,
			"base64",
		).toString();
	}

	// if (loaderData.tab === "issues") {
	// 	content = (
	// 		<Stack spacing={2}>
	// 			{loaderData.issues.map(
	// 				({ title, id, state, html_url }) => (
	// 					<Card
	// 						key={`issue-${id}`}
	// 						variant="outlined"
	// 					>
	// 						<CardContent>
	// 							<Typography>{title}</Typography>
	// 							<Typography>{state}</Typography>
	// 							<Typography
	// 								href={html_url}
	// 								component="a"
	// 								target="_blank"
	// 							>
	// 								{html_url}
	// 							</Typography>
	// 						</CardContent>
	// 					</Card>
	// 				),
	// 			)}
	// 		</Stack>
	// 	);
	// }

	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs
					paths={`~/${loaderData.repo.full_name}`}
				/>
			}
			seconadaryAction={
				<Stack
					spacing={1}
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					flexGrow={{ xs: 1, sm: 0 }}
				>
					<Tabs
						value={tab}
						onChange={(_, tab) => setTab(tab)}
					>
						<Tab
							value={0}
							label="~"
						/>
						<Tab
							value={1}
							label="Issues"
						/>
					</Tabs>
					<IconButton
						onClick={toggleDrawer}
						size="small"
						disableRipple
					>
						<ChevronLeftRounded />
					</IconButton>
				</Stack>
			}
		>
			{tab === 0 && (
				<Container maxWidth="sm">
					<Markdown
						emptyText="..."
						markdownContent={decodedReadme}
					/>
				</Container>
			)}
			<Drawer
				elevation={0}
				anchor="right"
				variant="temporary"
				open={drawerOpen}
				onClose={closeDrawer}
				PaperProps={{
					sx: {
						width: "max(250px, 30vw)",
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
					<Typography fontWeight="bold">
						Metadata
					</Typography>
					<IconButton
						size="small"
						onClick={closeDrawer}
					>
						<ClearRounded />
					</IconButton>
				</Toolbar>
				<Divider
					flexItem
					variant="fullWidth"
				/>
				<List>
					{toDetails(loaderData.repo).map(
						([label, value]) => (
							<ListItem key={label}>
								<ListItemText
									primary={label}
									secondary={value}
								/>
							</ListItem>
						),
					)}
				</List>
			</Drawer>
		</WithAppBar>
	);
};
