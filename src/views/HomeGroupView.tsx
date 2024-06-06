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

export const HomeGroupView: FC = () => {
	const { pathname: appPathname } = useLocation();
	const [tab, setTab] = useState<number>(0);
	useEffect(() => {
		switch (appPathname.toLowerCase()) {
			case "/repositories":
				setTab(0);
				break;
			case "/issues":
				setTab(1);
				break;
		}
	}, [appPathname]);

	const submit = useSubmit();
	const handleTabChange = (
		_: any,
		value: number,
	) => {
		let action = "/Repositories";
		switch (value) {
			case 1:
				action = "/Issues";
				break;
		}
		setTab(value);
		submit({}, { action });
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
					<Tabs
						value={tab}
						onChange={handleTabChange}
					>
						<Tab
							disableRipple
							value={0}
							label="Repositories"
						/>
						<Tab
							disableRipple
							value={1}
							label="Issues"
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
