import {
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { FC, ReactNode } from "react";

type LayoutPros = {
	slotMetadata: ReactNode;
};
export const Layout: FC<LayoutPros> = (props) => {
	const { slotMetadata } = props;

	return (
		<Container maxWidth="sm">
			<Stack marginY={2}>
				{slotMetadata}
				<Typography
					id="preview"
					maxWidth="100%"
					height="100%"
					overflow="auto"
					display="block"
					sx={{
						wordBreak: "break-word",
						wordWrap: "break-word",
						scrollbarWidth: "thin",
					}}
				/>
			</Stack>
		</Container>
	);
};
