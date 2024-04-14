import { Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import {
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

export const HomePage: FC = () => {
	const {
		name: loadedName,
		repos,
		topics,
		topicOptions,
	} = useLoaderData() as LoaderData;

	const { enqueueSnackbar } = useSnackbar();
	const submit = useSubmit();
	const [name, setName] = useState(loadedName);

	const handleFilterSubmit = () => {
		submit(
			{
				name,
				topics,
			},
			{
				action: "/",
				method: "get",
			},
		);
	};
	const handleTopicChange = (
		value: string[] | string,
	) => {
		submit(
			{
				name,
				topics: value,
			},
			{
				action: "/",
				method: "get",
			},
		);
	};

	return (
		<WithAppBar
			location={<StyledBreadcrumbs paths="~" />}
		>
			<Typography>
				Nothing to see here.
			</Typography>
		</WithAppBar>
	);
};
