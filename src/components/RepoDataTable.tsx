import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Typography,
} from "@mui/material";
import {
	FC,
	MouseEvent as ReactMouseEvent,
	useMemo,
	useState,
} from "react";
import { Link as RouterLink } from "react-router-dom";
import { normalizeDateString } from "~core/time";
import { RepoSchema } from "~types/schemas";

type Order = "asc" | "desc";

type HeadCell = {
	id: keyof RepoSchema;
	disablePadding?: boolean;
	sortable?: boolean;
	label: string;
	numeric: boolean;
};
const headCells: readonly HeadCell[] = [
	{
		id: "full_name",
		numeric: false,
		label: "Name",
	},
	{
		id: "is_private",
		numeric: false,
		label: "Visibility",
	},
	{
		id: "is_archived",
		numeric: false,
		label: "Status",
	},
	{
		id: "pushed_at",
		label: "Last pushed",
		numeric: false,
	},
	{
		id: "updated_at",
		label: "Last updated",
		numeric: false,
	},
	{
		id: "created_at",
		label: "Created",
		numeric: false,
	},
];

const orderByString = (
	a: string | null,
	b: string | null,
): number => {
	if (a === null || b === null) {
		return 0;
	}
	return a.localeCompare(b);
};

const orderByBoolean = (
	a: boolean | null | undefined,
	b: boolean | null | undefined,
) => {
	const a_ = Boolean(a);
	const b_ = Boolean(b);
	if (a_ === b_) {
		return 0;
	}
	if (a_ && !b_) {
		return -1;
	}
	return 1;
};

export const ORDER_BY: {
	[K in keyof RepoSchema]?: {
		[V in Order]: (
			a: RepoSchema,
			b: RepoSchema,
		) => number;
	};
} = {
	full_name: {
		desc: ({ full_name: a }, { full_name: b }) =>
			-orderByString(a, b),
		asc: ({ full_name: a }, { full_name: b }) =>
			orderByString(a, b),
	},
	is_archived: {
		desc: (
			{ is_archived: a },
			{ is_archived: b },
		) => -orderByBoolean(a, b),
		asc: (
			{ is_archived: a },
			{ is_archived: b },
		) => orderByBoolean(a, b),
	},
	is_private: {
		desc: (
			{ is_private: a },
			{ is_private: b },
		) => -orderByBoolean(a, b),
		asc: ({ is_private: a }, { is_private: b }) =>
			orderByBoolean(a, b),
	},
	pushed_at: {
		desc: ({ pushed_at: a }, { pushed_at: b }) =>
			orderByString(a, b),
		asc: ({ pushed_at: a }, { pushed_at: b }) =>
			-orderByString(a, b),
	},
	updated_at: {
		desc: (
			{ updated_at: a },
			{ updated_at: b },
		) => orderByString(a, b),
		asc: ({ updated_at: a }, { updated_at: b }) =>
			-orderByString(a, b),
	},
	created_at: {
		desc: (
			{ created_at: a },
			{ created_at: b },
		) => orderByString(a, b),
		asc: ({ created_at: a }, { created_at: b }) =>
			-orderByString(a, b),
	},
};

type StyledTableHeadProps = {
	order: Order;
	orderBy: keyof RepoSchema;
	onRequestSort: (
		value: keyof RepoSchema,
	) => void;
};
const StyledTableHead: FC<
	StyledTableHeadProps
> = (props: StyledTableHeadProps) => {
	const { order, orderBy, onRequestSort } = props;

	const createSortHandler =
		(property: keyof RepoSchema) =>
		(_: ReactMouseEvent<unknown>) => {
			onRequestSort(property);
		};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={
							headCell.numeric ? "right" : "left"
						}
						sortDirection={
							orderBy === headCell.id
								? order
								: undefined
						}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={
								orderBy === headCell.id
									? order
									: "asc"
							}
							onClick={createSortHandler(
								headCell.id,
							)}
						>
							{headCell.label}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
};

type StyledTableRowProps = {
	repo: RepoSchema;
};
const StyledTableRow: FC<StyledTableRowProps> = (
	props,
) => {
	const { repo } = props;

	return (
		<TableRow>
			<TableCell>
				<Typography
					component={RouterLink}
					to={`/${repo.full_name}`}
				>
					{repo.full_name}
				</Typography>
			</TableCell>
			<TableCell>
				{repo.is_private ? "Private" : "Public"}
			</TableCell>
			<TableCell>
				{repo.is_archived ? "Archived" : "Active"}
			</TableCell>
			<TableCell>
				{normalizeDateString(repo.pushed_at)}
			</TableCell>
			<TableCell>
				{normalizeDateString(repo.updated_at)}
			</TableCell>
			<TableCell>
				{normalizeDateString(repo.created_at)}
			</TableCell>
		</TableRow>
	);
};

type RepoDataTableProps = {
	repos: RepoSchema[];
};
export const RepoDataTable: React.FC<
	RepoDataTableProps
> = (props) => {
	const { repos } = props;

	const [order, setOrder] =
		useState<Order>("asc");
	const [orderBy, setOrderBy] =
		useState<keyof RepoSchema>("pushed_at");
	const handleRequestSort = (
		property: keyof RepoSchema,
	) => {
		const isAsc =
			orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const repos_ = useMemo(() => {
		const orderFn = ORDER_BY[orderBy];
		if (orderFn === undefined) {
			return repos;
		}
		const repos_ = [...repos];
		repos_.sort(orderFn[order]);
		return repos_;
	}, [order, orderBy, repos]);

	return (
		<Box
			sx={{
				minWidth: "95vw",
				overflow: "auto",
			}}
		>
			<TableContainer>
				<Table>
					<StyledTableHead
						onRequestSort={handleRequestSort}
						order={order}
						orderBy={orderBy}
					/>
					<TableBody>
						{repos_.map((repo) => (
							<StyledTableRow
								key={repo.full_name}
								repo={repo}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};
