import { Box, Tab, Tabs } from "@mui/material";
import { FC } from "react";
import {
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { RepoDataTable } from "~components/RepoDataTable";
import { MainView } from "~views/MainView";
import { TabNavView } from "~views/TabNavView";
import { LoaderData } from "./loader";

export const RepoListPage: FC = () => {
	const {
		repos,
		topicOptions,
		topics,
		name,
		visibility,
		status,
		topicMatchStrategy,
		properties,
	} = useLoaderData() as LoaderData;

	const submit = useSubmit();
	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		if (value === 1) {
			return;
		}
		const target = value === 0 ? "/" : "/Issues";
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
						value={1}
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
					<RepoDataTable
						topicOptions={topicOptions}
						repos={repos}
						topics={topics}
						name={name}
						visibility={visibility}
						status={status}
						topicMatchStrategy={
							topicMatchStrategy
						}
						properties={properties}
					/>
				</Box>
			</TabNavView>
		</MainView>
	);
};
