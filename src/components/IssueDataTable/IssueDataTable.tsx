import { Stack, Typography } from "@mui/material";
import { useIssueColumnHeaders } from "hooks/useIssueColumnHeaders";
import { getIssueSortFn } from "~core/sorting";
import { SelectOption } from "~types/generic";
import { IssueQuery } from "~types/query";
import { Issue } from "~types/schema";
import { StyledDataTable } from "../StyledDataTable";
import { StyledToolbar } from "./StyledToolbar";

type IssueDataTableProps = {
	orderBy?: keyof Issue;
	issues: Issue[];
	query: IssueQuery;
	repoOptions: SelectOption<string>[];
};
export const IssueDataTable: React.FC<
	IssueDataTableProps
> = (props) => {
	const { orderBy, issues, repoOptions, query } =
		props;

	const columnHeaders = useIssueColumnHeaders();
	const defaultOrderBy = orderBy ?? "updated_at";

	const itemCountMsg =
		issues.length === 1
			? `Showing 1 issue`
			: `Showing ${issues.length} issues`;

	return (
		<Stack spacing={2}>
			<StyledToolbar
				repoOptions={repoOptions}
				query={query}
			/>
			<Typography>{itemCountMsg}</Typography>
			<StyledDataTable
				items={issues}
				columnDefinition={columnHeaders}
				defaultOrderBy={defaultOrderBy}
				orderingFn={getIssueSortFn}
			/>
		</Stack>
	);
};
