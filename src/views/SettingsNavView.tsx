import {
	Box,
	Divider,
	Stack,
	Tab,
	Tabs,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { useSubmit } from "react-router-dom";
import { AppHeaderView } from "./AppHeaderView";

type SettingNavViewProps = {
	children: ReactNode;
	tab: number;
};
export const SettingNavView: FC<
	SettingNavViewProps
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
				target = "/Settings/Repository";
				break;
			case 2:
				target = "/Settings/Issue";
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
						disableTouchRipple
						value={0}
						label="Synchronization"
					/>
					<Tab
						disableRipple
						value={1}
						label="Repository"
					/>
					<Tab
						disableRipple
						value={2}
						label="Issue"
					/>
				</Tabs>
			}
		>
			<Box padding={2}>
				<Stack
					spacing={2}
					divider={
						<Divider
							flexItem
							variant="middle"
						/>
					}
				>
					{children}
				</Stack>
			</Box>
		</AppHeaderView>
	);
};
