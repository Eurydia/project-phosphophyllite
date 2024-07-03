import {
	AppBar,
	Divider,
	Tab,
	Tabs,
	Toolbar,
} from "@mui/material";
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
import { openSecretsDir } from "~api/secrets";
import { openSettingFile } from "~api/setting";
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

	const handleTabChange = async (
		_: any,
		value: number,
	) => {
		switch (value) {
			case 1:
				await openSettingFile();
				return;
			case 2:
				await openSecretsDir();
				return;
		}
	};

	return (
		<Fragment>
			<AppBar
				elevation={0}
				position="relative"
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
							label="Preferences"
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
			<Outlet />
		</Fragment>
	);
};
