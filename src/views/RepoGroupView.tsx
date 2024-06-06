import {
	AppBar,
	Box,
	Divider,
	Tab,
	Tabs,
} from "@mui/material";
import { useElementHeight } from "hooks/useElementHeight";
import { FC, Fragment, useState } from "react";
import {
	Outlet,
	useLocation,
	useSubmit,
} from "react-router-dom";
import { AppHeader } from "~components/AppHeader";

export const RepoGroupView: FC = () => {
	const [tab, setTab] = useState(0);
	const { pathname } = useLocation();
	const submit = useSubmit();
	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		setTab(value);
		let action = "";
		switch (value) {
			case 1:
				action = "./Metadata";
				break;
			case 2:
				action = "./Issues";
				break;
			default:
			case 0:
				action = pathname
					.split("/")
					.slice(0, 4)
					.join("/");
		}
		submit(
			{},
			{
				action,
			},
		);
	};

	const { elemRef, elemHeight } =
		useElementHeight();
	const contentHeight = `calc(100svh - ${elemHeight})`;

	return (
		<Fragment>
			<AppBar
				elevation={0}
				ref={elemRef}
			>
				<AppHeader />
				<Divider flexItem />
				<Tabs
					value={tab}
					onChange={handleTabChange}
				>
					<Tab
						disableTouchRipple
						value={0}
						label="Read me"
					/>
					<Tab
						disableTouchRipple
						value={1}
						label="Metadata"
					/>
					<Tab
						disableTouchRipple
						value={2}
						label="Issues"
					/>
				</Tabs>
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
