import {
	AppBar,
	Box,
	Grid,
	IconButton,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import {
	FC,
	Fragment,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { useSubmit } from "react-router-dom";
import { IconHexagonMultiple } from "~assets/HexagonGroup";

type WithAppBarProps = {
	location: ReactNode;
	children: ReactNode;
	seconadaryNav?: ReactNode;
};
export const WithAppBar: FC<WithAppBarProps> = (
	props,
) => {
	const { location, children, seconadaryNav } =
		props;

	const submit = useSubmit();
	const appBarRef = useRef<HTMLElement | null>(
		null,
	);
	const [appBarHeight, setAppBarHeight] =
		useState("100vh");

	useEffect(() => {
		if (
			appBarRef === null ||
			appBarRef.current === null
		) {
			return;
		}
		const height =
			appBarRef.current.getBoundingClientRect()
				.height;
		setAppBarHeight(`${height}px`);
	}, [appBarRef]);

	const handleRedirectHome = () => {
		submit({}, { action: "/", method: "get" });
	};
	const contentHeight = `calc(100vh - ${appBarHeight})`;
	return (
		<Fragment>
			<AppBar
				ref={appBarRef}
				variant="outlined"
				elevation={0}
				position="relative"
			>
				<Toolbar variant="regular">
					<Grid
						container
						spacing={1}
						alignItems="center"
					>
						<Grid
							item
							xs={1}
							display="flex"
							justifyContent="center"
						>
							<IconButton
								disableRipple
								title="Home"
								onClick={handleRedirectHome}
							>
								<IconHexagonMultiple />
							</IconButton>
						</Grid>
						<Grid
							item
							xs={5}
						>
							<Typography
								variant="body1"
								width="100%"
								overflow="hidden"
								whiteSpace="nowrap"
								textOverflow="ellipsis"
								fontWeight="500"
							>
								{location}
							</Typography>
						</Grid>
						<Grid
							item
							xs={6}
						>
							<Stack
								spacing={2}
								justifyContent="end"
								direction="row"
							>
								{seconadaryNav}
							</Stack>
						</Grid>
					</Grid>
				</Toolbar>
			</AppBar>
			<Box
				height={contentHeight}
				overflow="auto"
			>
				{children}
			</Box>
		</Fragment>
	);
};
