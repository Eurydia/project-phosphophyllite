import { SearchRounded } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useRepoQuery } from "hooks/useRepoQuery";
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
		setName,
		setStatus,
		setVisibility,
	} = useRepoQuery(initQuery);
	const { statusOptions, visibilityOptions } =
		useRepoQueryOptions();

	return (
		<Form replace>
			<Stack
				alignItems="start"
				spacing={1}
			>
				<Typography fontWeight="bold">
					Filter
				</Typography>
				<StyledTextField
					name="name"
					placeholder="Search repository"
					value={query.name}
					onChange={setName}
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
				<StyledIconButton type="submit">
					<SearchRounded />
				</StyledIconButton>
			</Stack>
		</Form>
	);
};
