import { Box, Container } from "@mui/material";
import { useIssueQueryOptions } from "hooks/useIssueQueryOptions";
import { useIssueQueryPreference } from "hooks/useIssueQueryPreference";
import { FC, useEffect, useRef } from "react";
import { useLoaderData } from "react-router";
import { setPrefIssue } from "resources/pref";
import { StyledGrid } from "~components/StyledGrid";
import { StyledSelect } from "~components/StyledSelect";
import { LoaderData } from "./loader";

export const SettingsIssuePage: FC = () => {
	const { pref: initPref } =
		useLoaderData() as LoaderData;

	const {
		ownerTypeOptions,
		stateOptions,
		sortByOptions,
		sortOrderOptions,
	} = useIssueQueryOptions();
	const {
		pref,
		setOwnerType,
		setState,
		setSortBy,
		setSortOrder,
	} = useIssueQueryPreference(initPref);
	const { ownerType, state, sortOrder, sortBy } =
		pref;
	useEffect(() => {
		setPrefIssue(pref);
	}, [pref]);

	const { current: headers } = useRef([
		"State",
		"Owner type",
		"Sort by",
		"Order",
	]);
	const items = [
		<StyledSelect
			value={state}
			options={stateOptions}
			onChange={setState}
		/>,
		<StyledSelect
			value={ownerType}
			options={ownerTypeOptions}
			onChange={setOwnerType}
		/>,
		<StyledSelect
			value={sortBy}
			options={sortByOptions}
			onChange={setSortBy}
		/>,
		<StyledSelect
			value={sortOrder}
			options={sortOrderOptions}
			onChange={setSortOrder}
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
