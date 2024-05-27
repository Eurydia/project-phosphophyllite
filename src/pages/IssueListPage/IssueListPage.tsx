import { Box, Tab, Tabs } from "@mui/material";
import { FC } from "react";
import {
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { MainView } from "~views/MainView";
import { TabNavView } from "~views/TabNavView";
import { LoaderData } from "./loader";

export const IssueListPage: FC = () => {
	const {
		issues,
		repoOptions,
		title,
		ownerType,
		repoFullNames,
		state,
	} = useLoaderData() as LoaderData;

	const submit = useSubmit();
	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		if (value === 2) {
			return;
		}
		const target =
			value === 0 ? "/" : "/Repositories";
		submit(
			{},
			{
				action: target,
				method: "get",
			},
		);
	};

	return (
		<MainView>
			<TabNavView
				nav={
					<Tabs
						value={2}
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
				<Box padding={2}>
					<IssueDataTable
						issues={issues}
						repoOptions={repoOptions}
						title={title}
						ownerType={ownerType}
						repoFullNames={repoFullNames}
						state={state}
					/>
				</Box>
			</TabNavView>
		</MainView>
	);
};
