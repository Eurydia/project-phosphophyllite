import {
	Box,
	Button,
	Stack,
	Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useMemo, useState } from "react";
import {
	Link,
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { StyledDataTable } from "~components/StyledDataTable";
import { StyledTextField } from "~components/StyledTextField";
import { orderByString } from "~core/sorting";
import { addCollection } from "~database/cached";
import { GenericDataCell } from "~types/generics";
import { CollectionSchema } from "~types/schemas";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

const COLUMN_DEFINITION: GenericDataCell<CollectionSchema>[] =
	[
		{
			label: "Name",
			id: "name",
			render: (collection) => (
				<Typography
					component={Link}
					to={`/collections/${collection.name}`}
				>
					{collection.name}
				</Typography>
			),
		},
	];

const orderingFn = (
	property: keyof CollectionSchema,
):
	| ((
			a: CollectionSchema,
			b: CollectionSchema,
	  ) => number)
	| undefined => {
	switch (property) {
		case "name":
			return (a, b) =>
				orderByString(a.name, b.name);
	}
};

export const CollectionListPage: FC = () => {
	const { collections } =
		useLoaderData() as LoaderData;
	const { enqueueSnackbar } = useSnackbar();
	const submit = useSubmit();

	const usedNames = useMemo(() => {
		return collections.map(({ name }) => name);
	}, [collections]);

	const [name, setName] = useState("");
	const handleCollectionCreate = async () => {
		const res = await addCollection(
			name,
			"",
			[],
		).then(
			() => {
				enqueueSnackbar({
					message: "Added collection",
					variant: "success",
				});
				return true;
			},
			(err) => {
				enqueueSnackbar({
					message: String(err),
					variant: "error",
				});
				return false;
			},
		);
		if (res) {
			submit({}, { action: "./", method: "get" });
		}
	};

	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs
					path="~/collections"
					breadcrumbsProps={{
						sx: { flexGrow: 1 },
					}}
				/>
			}
		>
			<Box
				paddingTop={2}
				paddingX={2}
			>
				<Stack
					flexDirection="row"
					alignItems="center"
					gap={1}
				>
					<StyledTextField
						color={
							usedNames.includes(name)
								? "warning"
								: undefined
						}
						size="small"
						placeholder="Collection name"
						value={name}
						onChange={setName}
						onEnter={handleCollectionCreate}
					/>
					<Button
						disableElevation
						variant="contained"
						onClick={handleCollectionCreate}
					>
						new collection
					</Button>
				</Stack>
				<StyledDataTable
					items={collections}
					defaultOrderBy="name"
					columnDefinition={COLUMN_DEFINITION}
					orderingFn={orderingFn}
				/>
			</Box>
		</WithAppBar>
	);
};
