import {
	Grid,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { IssueCard } from "~components/IssueCard";
import { IssueQueryForm } from "~components/IssueQueryForm";
import { PaddedPaper } from "~components/PaddedPaper";
import { DualColumnLayout } from "~layouts/DualColumnLayout";
import { LoaderData } from "./loader";

export const IssueListPage: FC = () => {
	const { issues, query } =
		useLoaderData() as LoaderData;
	const { breakpoints } = useTheme();
	const single = useMediaQuery(
		breakpoints.down("md"),
	);
	const count = issues.length;
	const itemCountMsg =
		count === 1
			? `Showing 1 issue`
			: `Showing ${count} issues`;
	const formElement = (
		<PaddedPaper
			square
			variant="outlined"
		>
			<IssueQueryForm initQuery={query} />
			<Typography>{itemCountMsg}</Typography>
		</PaddedPaper>
	);
	const items = issues.map((issue, index) => (
		<IssueCard
			key={`item-${index}`}
			issue={issue}
		/>
	));
	const overflow = !single ? "auto" : undefined;
	return (
		<Grid
			container
			paddingTop={2}
			paddingLeft={2}
			columns={12}
			spacing={2}
			height="100%"
		>
			<Grid
				item
				xs={12}
				md={3}
			>
				{formElement}
			</Grid>
			<Grid
				item
				xs={12}
				md={9}
				height="100%"
				paddingRight={2}
				overflow={overflow}
			>
				<DualColumnLayout
					items={items}
					single={single}
				/>
			</Grid>
		</Grid>
	);
};
