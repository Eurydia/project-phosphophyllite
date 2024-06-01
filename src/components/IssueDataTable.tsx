import { Stack, Typography } from "@mui/material";
import { useIssueColumnHeaders } from "hooks/useIssueColumnHeaders";
import { getIssueSortFn } from "~core/sorting";
import { IssueSchema } from "~types/schema";
import { StyledDataTable } from "./StyledDataTable";

type IssueDataTableProps = {
	orderBy?: keyof IssueSchema;
	issues: IssueSchema[];
};
export const IssueDataTable: React.FC<
	IssueDataTableProps
> = (props) => {
	const { orderBy, issues } = props;

	const columnHeaders = useIssueColumnHeaders();
	const defaultOrderBy = orderBy ?? "updatedAt";

	const itemCountMsg =
		issues.length === 1
			? `Showing 1 issue`
			: `Showing ${issues.length} issues`;
	return (
		<Stack spacing={2}>
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
