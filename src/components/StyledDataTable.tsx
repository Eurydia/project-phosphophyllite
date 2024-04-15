import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
} from "@mui/material";
import {
	MouseEvent,
	ReactNode,
	useMemo,
	useState,
} from "react";

type DataCell<T> = {
	id: keyof T;
	label: string;
	render: (item: T) => ReactNode;
};

type StyledTableHeadProps<T> = {
	order: "asc" | "desc";
	orderBy: keyof T;
	onRequestSort: (value: keyof T) => void;
	columnDefinition: DataCell<T>[];
};
const StyledTableHead = <T,>(
	props: StyledTableHeadProps<T>,
) => {
	const {
		order,
		orderBy,
		onRequestSort,
		columnDefinition,
	} = props;

	const createSortHandler =
		(property: keyof T) =>
		(_: MouseEvent<unknown>) => {
			onRequestSort(property);
		};

	return (
		<TableHead>
			<TableRow>
				{columnDefinition.map(
					({ id, label }, index) => (
						<TableCell
							key={`cell-${index}`}
							sortDirection={
								orderBy === id ? order : undefined
							}
						>
							<TableSortLabel
								active={orderBy === id}
								direction={
									orderBy === id ? order : "asc"
								}
								onClick={createSortHandler(id)}
							>
								{label}
							</TableSortLabel>
						</TableCell>
					),
				)}
			</TableRow>
		</TableHead>
	);
};

type StyledTableRowProps<T> = {
	item: T;
	columnDefinition: DataCell<T>[];
};
const StyledTableRow = <T,>(
	props: StyledTableRowProps<T>,
) => {
	const { item, columnDefinition } = props;

	return (
		<TableRow>
			{columnDefinition.map(
				({ render }, index) => (
					<TableCell key={`data-cell-${index}`}>
						{render(item)}
					</TableCell>
				),
			)}
		</TableRow>
	);
};

type StyledDataTableProps<T> = {
	items: T[];
	columnDefinition: DataCell<T>[];
	defaultOrderBy: keyof T;
	orderingFn: (
		property: keyof T,
	) => ((a: T, b: T) => number) | undefined;
};
export const StyledDataTable = <T,>(
	props: StyledDataTableProps<T>,
) => {
	const {
		orderingFn,
		items,
		columnDefinition,
		defaultOrderBy: orderBy,
	} = props;

	const [order, setOrder] = useState<
		"asc" | "desc"
	>("desc");
	const [orderBy_, setOrderBy] =
		useState(orderBy);

	const handleRequestSort = (
		property: keyof T,
	) => {
		const isAsc =
			orderBy_ === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const items_ = useMemo(() => {
		const orderFn:
			| ((a: T, b: T) => number)
			| undefined = orderingFn(orderBy_);

		if (orderFn === undefined) {
			return items;
		}
		const orderedItems_ = [...items];
		orderedItems_.sort(orderFn);
		if (order === "asc") {
			orderedItems_.reverse();
		}
		return orderedItems_;
	}, [order, orderBy_, items]);

	return (
		<TableContainer>
			<Table>
				<StyledTableHead
					columnDefinition={columnDefinition}
					onRequestSort={handleRequestSort}
					order={order}
					orderBy={orderBy_}
				/>
				<TableBody>
					{items_.map((item, index) => (
						<StyledTableRow
							key={`data-cell-item-${index}`}
							item={item}
							columnDefinition={columnDefinition}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
