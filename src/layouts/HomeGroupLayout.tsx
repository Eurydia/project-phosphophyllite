import {
	AppBar,
	Box,
	Divider,
	Tab,
	Tabs,
	Toolbar,
} from "@mui/material";
import { useElementHeight } from "hooks/useElementHeight";
import {
	FC,
	Fragment,
	useEffect,
	useState,
} from "react";
import {
	Outlet,
	useLocation,
	useSubmit,
} from "react-router-dom";
import { AppHeader } from "~components/AppHeader";

export const HomeGroupLayout: FC = () => {
	const { pathname: appPathname } = useLocation();
	const [tab, setTab] = useState<number>(0);
	useEffect(() => {
		switch (appPathname.toLowerCase()) {
			case "/repositories":
				setTab(1);
				break;
			case "/issues":
				setTab(2);
				break;
			default:
				setTab(0);
				break;
		}
	}, [appPathname]);

	const submit = useSubmit();
	const goToHome = () => {
		submit({}, { action: "/", method: "get" });
	};
	const goToRepos = () => {
		submit(
			{},
			{ action: "/Repositories", method: "get" },
		);
	};
	const goToIssues = () => {
		submit(
			{},
			{ action: "/Issues", method: "get" },
		);
	};

	const { elemRef, elemHeight } =
		useElementHeight();
	const contentHeight = `calc(100svh - ${elemHeight})`;

	return (
		<Fragment>
			<AppBar
				ref={elemRef}
				elevation={0}
			>
				<AppHeader />
				<Divider flexItem />
				<Toolbar
					disableGutters
					variant="dense"
				>
					<Tabs value={tab}>
						<Tab
							disableRipple
							value={0}
							label="Overview"
							onClick={goToHome}
						/>
						<Tab
							disableRipple
							value={1}
							label="Repositories"
							onClick={goToRepos}
						/>
						<Tab
							disableRipple
							value={2}
							label="Issues"
							onClick={goToIssues}
						/>
					</Tabs>
				</Toolbar>
				<Divider flexItem />
			</AppBar>
			<Box
				marginTop={elemHeight}
				height={contentHeight}
				overflow="auto"
			>
				<Outlet />
			</Box>
		</Fragment>
	);
};
