import {
	FC,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { Box, Grid } from "@mui/material";

type LayoutPros = {
	childLeft: ReactNode;
	childRight: ReactNode;
};
export const Layout: FC<LayoutPros> = (props) => {
	const { childLeft, childRight } = props;

	const contentRef =
		useRef<HTMLDivElement | null>(null);
	const [contentHeight, setEditorHeight] =
		useState("");
	useEffect(() => {
		if (!contentRef || !contentRef.current) {
			return;
		}
		const topOffset =
			contentRef.current.offsetTop;
		setEditorHeight(
			`calc(100vh - ${Math.ceil(topOffset)}px)`,
		);
	}, [contentRef]);

	return (
		<Box
			ref={contentRef}
			overflow="hidden"
		>
			<Grid
				container
				spacing={2}
				paddingTop={2}
				paddingLeft={2}
			>
				<Grid
					item
					md={6}
					height={contentHeight}
				>
					{childLeft}
				</Grid>
				<Grid
					item
					md={6}
					height={contentHeight}
					overflow="auto"
				>
					{childRight}
				</Grid>
			</Grid>
		</Box>
	);
};
