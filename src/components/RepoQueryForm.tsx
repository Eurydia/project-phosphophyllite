import { SearchRounded } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useRepoQueryForm } from "hooks/useRepoQueryForm";
import { useRepoQueryOptions } from "hooks/useRepoQueryOptions";
import { FC } from "react";
import { Form } from "react-router-dom";
import { RepoQuery } from "~types/query";
import { StyledIconButton } from "./StyledIconButton";
import { StyledSelect } from "./StyledSelect";
import { StyledTextField } from "./StyledTextField";

type RepoQueryFormProps = {
	initQuery: RepoQuery;
};
export const RepoQueryForm: FC<
	RepoQueryFormProps
> = (props) => {
	const { initQuery } = props;
	const {
		query,
		setSortBy,
		setFullName,
		setStatus,
		setVisibility,
		setSortOrder,
	} = useRepoQueryForm(initQuery);
	const {
		statusOptions,
		visibilityOptions,
		sortByOptions,
		sortOrderOptions,
	} = useRepoQueryOptions();
	return (
		<Form replace>
			<Stack
				alignItems="start"
				spacing={1}
			>
				<Typography fontWeight="bold">
					Filtering
				</Typography>
				<StyledTextField
					name="fullName"
					placeholder="Search repository"
					value={query.fullName}
					onChange={setFullName}
				/>
				<StyledSelect
					label="Visibility"
					name="visibility"
					value={query.visibility}
					onChange={setVisibility}
					options={visibilityOptions}
				/>
				<StyledSelect
					label="Status"
					name="status"
					value={query.status}
					onChange={setStatus}
					options={statusOptions}
				/>
				<Typography fontWeight="bold">
					Sorting
				</Typography>
				<StyledSelect
					label="Sort by"
					name="sortBy"
					value={query.sortBy}
					onChange={setSortBy}
					options={sortByOptions}
				/>
				<StyledSelect
					label="Order"
					name="sortOrder"
					value={query.sortOrder}
					onChange={setSortOrder}
					options={sortOrderOptions}
				/>
				<StyledIconButton type="submit">
					<SearchRounded />
				</StyledIconButton>
			</Stack>
		</Form>
	);
};
