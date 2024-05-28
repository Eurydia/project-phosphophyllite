import { Stack, Typography } from "@mui/material";
import { useRepoColumnHeaders } from "hooks/useRepoColumnHeaders";
import { getRepoOrderingFn } from "~core/sorting";
import { SelectOption } from "~types/generics";
import { RepoQuery } from "~types/query";
import { RepoSchema } from "~types/schemas";
import { StyledDataTable } from "../StyledDataTable";
import { StyledToolbar } from "./StyledToolbar";

type RepoDataTableProps = {
	orderBy?: keyof RepoSchema;
	topicOptions: SelectOption<string>[];
	query: RepoQuery;
	repos: RepoSchema[];
};
export const RepoDataTable: React.FC<
	RepoDataTableProps
> = (props) => {
	const { orderBy, repos, query, topicOptions } =
		props;

	const columnHeaders = useRepoColumnHeaders();
	const defaultOrderBy = orderBy ?? "pushed_at";

	const itemCountMsg =
		repos.length === 1
			? `Showing 1 repository`
			: `Showing ${repos.length} repositories`;
	return (
		<Stack spacing={2}>
			<StyledToolbar
				itemCount={repos.length}
				query={query}
				topicOptions={topicOptions}
			/>
			<Typography>{itemCountMsg}</Typography>
			<StyledDataTable
				items={repos}
				orderingFn={getRepoOrderingFn}
				defaultOrderBy={defaultOrderBy}
				columnDefinition={columnHeaders}
			/>
		</Stack>
	);
};
