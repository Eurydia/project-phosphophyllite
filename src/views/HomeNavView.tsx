import { Stack, Tab, Tabs } from "@mui/material";
import { FC, ReactNode } from "react";
import { useSubmit } from "react-router-dom";
import { AppHeaderView } from "./AppHeaderView";

type HomeNavViewProps = {
	children: ReactNode;
	tab: number;
};
export const HomeNavView: FC<HomeNavViewProps> = (
	props,
) => {
	const { children, tab } = props;
	const submit = useSubmit();
	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		let target = "/";
		switch (value) {
			case 1:
				target = "/Repositories";
				break;
			case 2:
				target = "/Issues";
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
						label="Overview"
					/>
					<Tab
						disableRipple
						value={1}
						label="Repositories"
					/>
					<Tab
						disableRipple
						value={2}
						label="Issues"
					/>
				</Tabs>
			}
		>
			<Stack
				spacing={2}
				padding={2}
			>
				{children}
			</Stack>
		</AppHeaderView>
	);
};
