import { FC, Fragment } from "react";
import {
	Box,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";
import {
	LoaderFunction,
	Link as RouterLink,
	useLoaderData,
} from "react-router-dom";
import {
	CreateNewFolderRounded,
	OpenInNewRounded,
} from "@mui/icons-material";
import { getProjectAll } from "~database";
import { ProjectSchema } from "~types/schemas";
import { WithAppBar } from "~views/WithAppBar";

export const homeLoader: LoaderFunction =
	async () => {
		document.title = "Home";
		const projects = await getProjectAll();
		projects.sort(
			(a, b) =>
				b.lastModified.getTime() -
				a.lastModified.getTime(),
		);

		return projects;
	};

export const sortOptions = [
	{ value: "project_id", label: "Id" },
	{
		value: "last_modified",
		label: "Last modified",
	},
];

export const Home: FC = () => {
	const projects =
		useLoaderData() as ProjectSchema[];

	// const navigate = useNavigate();
	// const sortButtonRef =
	// 	useRef<HTMLButtonElement | null>(null);
	// const [sortMenuAnchor, setSortMenuAnchor] =
	// 	useState<HTMLButtonElement | null>(null);

	return (
		<Fragment>
			<WithAppBar location="Projects">
				<Box padding={4}>
					<Stack
						direction="row"
						justifyContent="space-between"
					>
						<Button
							variant="contained"
							component={RouterLink}
							to="/project/create"
							startIcon={
								<CreateNewFolderRounded />
							}
						>
							new project
						</Button>
						{/* <Button
							ref={sortButtonRef}
							variant="outlined"
							endIcon={<ExpandMoreRounded />}
							onClick={() =>
								setSortMenuAnchor(
									sortButtonRef.current,
								)
							}
						>
							Sort
						</Button> */}
					</Stack>
					<List>
						{projects.map((project, index) => (
							<ListItem
								key={`${project.name}-${index}`}
							>
								<ListItemText
									inset
									title={project.name}
									primaryTypographyProps={{
										overflow: "hidden",
										textOverflow: "ellipsis",
										whiteSpace: "nowrap",
										width: "50%",
									}}
									secondary={project.tags.join(
										", ",
									)}
									secondaryTypographyProps={{
										width: "50%",
									}}
								>
									{project.name}
								</ListItemText>
								<ListItemSecondaryAction>
									<IconButton
										component={RouterLink}
										to={`project/${project.projectId}`}
										title="Open"
									>
										<OpenInNewRounded />
									</IconButton>
								</ListItemSecondaryAction>
							</ListItem>
						))}
					</List>
				</Box>
			</WithAppBar>
			{/* <Popover
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
				anchorEl={sortMenuAnchor}
				open={sortMenuAnchor !== null}
				onClose={() => setSortMenuAnchor(null)}
			>
				<MenuList>
					{sortOptions.map(
						({ label, value }, index) => (
							<MenuItem
								key={value}
								value={value}
								onClick={() =>
									navigate(
										`/?${createSearchParams({
											sort_by: value,
										})}`,
									)
								}
							>
								<ListItemIcon>
									{(value === sortBy ||
										(!sortBy && index === 0)) && (
										<CheckRounded />
									)}
								</ListItemIcon>
								<ListItemText>
									{label}
								</ListItemText>
							</MenuItem>
						),
					)}
				</MenuList>
			</Popover> */}
		</Fragment>
	);
};
