import { CircularProgress } from "@mui/material";
import { FC, useEffect } from "react";
import {
	useParams,
	useSubmit,
} from "react-router-dom";

export const RepoOwnerListPage: FC = () => {
	const { owner } = useParams();
	const submit = useSubmit();

	useEffect(() => {
		setTimeout(() => {
			submit(
				{ fullName: owner ?? "" },
				{ action: "/Repositories" },
			);
		}, 1000);
	}, []);
	return <CircularProgress color="secondary" />;
};
