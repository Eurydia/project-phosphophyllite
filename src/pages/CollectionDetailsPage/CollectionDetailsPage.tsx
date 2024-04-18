import {
	Box,
	Button,
	SelectChangeEvent,
} from "@mui/material";
import { FC, ReactNode, useState } from "react";
import {
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { RepoDataTable } from "~components/RepoDataTable";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { StyledSelectMultiple } from "~components/StyledSelectMultiple";
import { updateCollection } from "~database/cached";
import { GenericSelectOptions } from "~types/generics";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

export const CollectionDetailsPage: FC = () => {
	const { collection, repos, collectedRepos } =
		useLoaderData() as LoaderData;
	const submit = useSubmit();

	const [items, setCollected] = useState(
		collection.repos,
	);

	const options: GenericSelectOptions<string>[] =
		repos.map((value) => ({
			label: value,
			value,
		}));

	const handleItemChange = (
		event: SelectChangeEvent<string[]>,
		_: ReactNode,
	) => {
		const values = event.target.value
			.toString()
			.split(",");
		setCollected(values);
	};
	const handleSubmit = async () => {
		const res = await updateCollection(
			collection.name,
			collection.description ?? "",
			items,
		);
		if (res) {
			submit({}, { action: "./", method: "get" });
		}
	};

	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs
					path={`~/collections/${collection.name}`}
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
				<StyledSelectMultiple
					fullWidth
					options={options}
					value={items}
					onChange={handleItemChange}
				/>
				<Button
					disableElevation
					variant="contained"
					onClick={handleSubmit}
				>
					Save
				</Button>
				<RepoDataTable repos={collectedRepos} />
			</Box>
		</WithAppBar>
	);
};
