import { Box, Tab, Tabs } from "@mui/material";
import { FC, ReactNode } from "react";
import { useSubmit } from "react-router-dom";
import { AppHeaderView } from "./AppHeaderView";

type HomeNavViewProps = {
	children: ReactNode;
	tab: number;
};
export const SettingNavView: FC<
	HomeNavViewProps
> = (props) => {
	const { children, tab } = props;
	const submit = useSubmit();
	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		let target = "/Settings";
		switch (value) {
			case 1:
				target = "/Settings/Repositories";
				break;
			case 2:
				target = "/Settings/Issues";
				break;
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
						disableRipple
						value={0}
						label="Synchronization"
					/>
					<Tab
						disableRipple
						value={1}
						label="Repository filter"
					/>
					<Tab
						disableRipple
						value={2}
						label="Issue filter"
					/>
				</Tabs>
			}
		>
			<Box padding={2}>{children}</Box>
		</AppHeaderView>
	);
};
