import { SearchRounded } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useIssueQuery } from "hooks/useIssueQuery";
import { useIssueQueryOptions } from "hooks/useIssueQueryOptions";
import { FC } from "react";
import { Form } from "react-router-dom";
import { IssueQuery } from "~types/query";
import { StyledIconButton } from "./StyledIconButton";
import { StyledSelect } from "./StyledSelect";
import { StyledTextField } from "./StyledTextField";

type IssueQueryFormProps = {
	initQuery: IssueQuery;
};
export const IssueQueryForm: FC<
	IssueQueryFormProps
> = (props) => {
	const { initQuery } = props;
	const {
		query,
		setSortBy,
		setSortOrder,
		setOwnerType,
		setState,
		setTitle,
	} = useIssueQuery(initQuery);
	const {
		ownerTypeOptions,
		stateOptions,
		sortByOptions,
		sortOrderOptions,
	} = useIssueQueryOptions();
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
					name="title"
					placeholder="Search an issue"
					value={query.title}
					onChange={setTitle}
				/>
				<StyledSelect
					label="State"
					name="state"
					value={query.state}
					onChange={setState}
					options={stateOptions}
				/>
				<StyledSelect
					label="Type"
					name="ownerType"
					value={query.ownerType}
					onChange={setOwnerType}
					options={ownerTypeOptions}
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
