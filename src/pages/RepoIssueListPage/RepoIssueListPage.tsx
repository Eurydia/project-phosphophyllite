import { Box, Tab, Tabs } from "@mui/material";
import { FC } from "react";
import {
	useLoaderData,
	useLocation,
} from "react-router";
import { useSubmit } from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { MainView } from "~views/MainView";
import { TabNavView } from "~views/TabNavView";
import { LoaderData } from "./loader";

export const RepoIssueListPage: FC = () => {
	const {
		repoOptions,
		issues,
		title,
		ownerType,
		repoFullNames,
		state,
	} = useLoaderData() as LoaderData;

	const { pathname } = useLocation();
	const submit = useSubmit();

	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		if (value === 1) {
			return;
		}
		const paths = pathname
			.split("/")
			.slice(0, -1);
		const target = paths.join("/");
		submit({}, { action: target, method: "get" });
	};

	return (
		<MainView>
			<TabNavView
				nav={
					<Tabs
						value={1}
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
				<Box padding={2}>
					<IssueDataTable
						repoOptions={repoOptions}
						issues={issues}
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
