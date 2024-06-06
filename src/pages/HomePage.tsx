import { CircularProgress } from "@mui/material";
import { FC, useEffect } from "react";
import { useSubmit } from "react-router-dom";

export const HomePage: FC = () => {
	const submit = useSubmit();

	useEffect(() => {
		setTimeout(() => {
			submit({}, { action: "/Repositories" });
		}, 1000);
	}, []);
	return <CircularProgress color="secondary" />;
};
