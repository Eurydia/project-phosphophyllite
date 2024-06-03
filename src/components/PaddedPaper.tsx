import { Paper, styled } from "@mui/material";

export const PaddedPaper = styled(Paper)(
	({ theme }) => ({
		padding: theme.spacing(2),
	}),
);
