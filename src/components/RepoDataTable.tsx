import { Stack, Typography } from "@mui/material";
import { useRepoColumnHeaders } from "hooks/useRepoColumnHeaders";
import { getRepoSortFn } from "~core/sorting";
import { RepoSchema } from "~types/schema";
import { StyledDataTable } from "./StyledDataTable";

type RepoDataTableProps = {
	orderBy?: keyof RepoSchema;
	repos: RepoSchema[];
};
export const RepoDataTable: React.FC<
	RepoDataTableProps
> = (props) => {
	const { orderBy, repos } = props;

	const columnHeaders = useRepoColumnHeaders();
	const defaultOrderBy = orderBy ?? "pushedAt";

	const itemCountMsg =
		repos.length === 1
			? `Showing 1 repository`
			: `Showing ${repos.length} repositories`;
	return (
		<Stack spacing={2}>
			<Typography>{itemCountMsg}</Typography>
			<StyledDataTable
				items={repos}
				orderingFn={getRepoSortFn}
				defaultOrderBy={defaultOrderBy}
				columnDefinition={columnHeaders}
			/>
		</Stack>
	);
};
