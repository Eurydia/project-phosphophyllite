import {
	Box,
	Divider,
	Stack,
	Tab,
	Tabs,
} from "@mui/material";
import { FC, useState } from "react";
import {
	Outlet,
	useLocation,
	useSubmit,
} from "react-router-dom";
import { AppHeader } from "~components/AppHeader";

export const RepoDetailsGroupView: FC = () => {
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
				method: "get",
			},
		);
	};

	return (
		<Stack>
			<AppHeader />
			<Divider flexItem />
			<Tabs
				value={tab}
				onChange={handleTabChange}
			>
				<Tab
					value={0}
					label="Details"
				/>
				<Tab
					value={1}
					label="Issues"
				/>
			</Tabs>
			<Divider flexItem />
			<Box padding={2}>
				<Outlet />
			</Box>
		</Stack>
	);
};
