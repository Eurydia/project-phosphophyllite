import { Box, Container } from "@mui/material";
import { useRepoQueryOptions } from "hooks/useRepoQueryOptions";
import { useRepoQueryPreference } from "hooks/useRepoQueryPreference";
import { FC, useEffect, useRef } from "react";
import { useLoaderData } from "react-router";
import { setPrefRepo } from "resources/pref";
import { StyledGrid } from "~components/StyledGrid";
import { StyledSelect } from "~components/StyledSelect";
import { LoaderData } from "./loader";

export const SettingsRepoPage: FC = () => {
	const { pref: initPref } =
		useLoaderData() as LoaderData;

	const {
		sortByOptions,
		sortOrderOptions,
		statusOptions,
		visibilityOptions,
	} = useRepoQueryOptions();
	const {
		pref,
		setSortBy,
		setSortOrder,
		setStatus,
		setVisibility,
	} = useRepoQueryPreference(initPref);
	const {
		status,
		visibility,
		sortOrder,
		sortBy,
	} = pref;
	useEffect(() => {
		setPrefRepo(pref);
	}, [pref]);

	const { current: headers } = useRef([
		"Visibility",
		"Status",
		"Sort by",
		"Order",
	]);
	const items = [
		<StyledSelect
			value={visibility}
			onChange={setVisibility}
			options={visibilityOptions}
		/>,
		<StyledSelect
			value={status}
			onChange={setStatus}
			options={statusOptions}
		/>,
		<StyledSelect
			value={sortBy}
			onChange={setSortBy}
			options={sortByOptions}
		/>,
		<StyledSelect
			value={sortOrder}
			onChange={setSortOrder}
			options={sortOrderOptions}
		/>,
	];

	return (
		<Container maxWidth="lg">
			<Box padding={2}>
				<StyledGrid
					headers={headers}
					items={items}
				/>
			</Box>
		</Container>
	);
};
