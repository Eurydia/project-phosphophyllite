import {
	ExpandLessRounded,
	ExpandMoreRounded,
} from "@mui/icons-material";
import {
	Collapse,
	Stack,
	Toolbar,
} from "@mui/material";
import { FC, ReactNode, useState } from "react";
import { StyledIconButton } from "./StyledIconButton";

type StyledTableToolbarProps = {
	toolbar: ReactNode;
	children: ReactNode;
};
export const StyledTableToolbar: FC<
	StyledTableToolbarProps
> = (props) => {
	const { children, toolbar } = props;

	const [filterOpen, setFilterOpen] =
		useState(false);
	const toggleFilter = () => {
		setFilterOpen(!filterOpen);
	};

	const expandIcon = filterOpen ? (
		<ExpandLessRounded />
	) : (
		<ExpandMoreRounded />
	);

	return (
		<Stack spacing={1}>
			<Toolbar
				disableGutters
				variant="dense"
			>
				<Stack
					useFlexGap
					spacing={2}
					width="100%"
					flexWrap="wrap"
					direction="row"
					alignItems="center"
					justifyContent="space-between"
				>
					<Stack
						width="70%"
						direction="row"
						alignItems="center"
					>
						{toolbar}
					</Stack>
					<StyledIconButton
						onClick={toggleFilter}
					>
						{expandIcon}
					</StyledIconButton>
				</Stack>
			</Toolbar>
			<Collapse in={filterOpen}>
				<Stack spacing={2}>{children}</Stack>
			</Collapse>
		</Stack>
	);
};
