import { Box, Tab, Tabs } from "@mui/material";
import { FC, ReactNode } from "react";
import {
	useLocation,
	useSubmit,
} from "react-router-dom";
import { AppHeaderView } from "./AppHeaderView";

type RepoDetailsNavViewProps = {
	children: ReactNode;
	tab: number;
};
export const RepoDetailsNavView: FC<
	RepoDetailsNavViewProps
> = (props) => {
	const { children, tab } = props;
	const submit = useSubmit();
	const { pathname } = useLocation();
	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		let target = "";
		switch (value) {
			case 1:
				target = "./Issues";
				break;
			default:
			case 0:
				target = pathname
					.split("/")
					.slice(0, 4)
					.join("/");
		}
		submit(
			{},
			{
				action: target,
				method: "get",
			},
		);
	};

	return (
		<AppHeaderView
			nav={
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
			}
		>
			<Box padding={2}>{children}</Box>
		</AppHeaderView>
	);
};
