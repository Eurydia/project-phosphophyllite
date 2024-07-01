import {
	AppBar,
	Box,
	Divider,
	Tab,
	Tabs,
	Toolbar,
} from "@mui/material";
import { invoke } from "@tauri-apps/api";
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
} from "react-router-dom";
import { AppHeader } from "~components/AppHeader";

export const SettingGroupView: FC = () => {
	const { pathname: appPathname } = useLocation();
	const [tab, setTab] = useState<number>(0);
	useEffect(() => {
		switch (appPathname.toLowerCase()) {
			case "/settings":
				setTab(0);
				break;
			case "/settings/repositories":
				setTab(1);
				break;
			case "/settings/issues":
				setTab(2);
				break;
		}
	}, [appPathname]);
	const { elemRef, elemHeight } =
		useElementHeight();
	const contentHeight = `calc(100svh - ${elemHeight})`;

	const handleTabChange = (
		_: any,
		value: number,
	) => {
		switch (value) {
			case 1:
				invoke("open_preference_file");
				return;
			case 2:
				invoke("open_secret_dir");
				return;
		}
		setTab(value);
	};

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
							label="Synchronization"
						/>
						<Tab
							disableRipple
							value={1}
							label="Preference settings"
						/>
						<Tab
							disableRipple
							label="Secrets"
							value={2}
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
