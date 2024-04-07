import { Container, Stack } from "@mui/material";
import { FC, ReactNode } from "react";

type LayoutPros = {
	children: ReactNode;
};
export const Layout: FC<LayoutPros> = (props) => {
	const { children } = props;

	return (
		<Container maxWidth="md">
			<Stack marginY={2}>{children}</Stack>
		</Container>
	);
};
