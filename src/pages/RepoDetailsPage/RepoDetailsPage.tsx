import {
	Container,
	Tab,
	Tabs,
} from "@mui/material";
import { Buffer } from "buffer";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { Markdown } from "~components/Markdown";
import { MainView } from "~views/MainView";
import { TabNavView } from "~views/TabNavView";
import { LoaderData } from "./loader";

export const RepoDetailsPage: FC = () => {
	const { repo } = useLoaderData() as LoaderData;

	const submit = useSubmit();
	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		if (value === 0) {
			return;
		}
		submit(
			{},
			{ action: "./Issues", method: "get" },
		);
	};

	let decodedReadme: string | undefined;
	if (repo.readme !== undefined) {
		decodedReadme = Buffer.from(
			repo.readme,
			"base64",
		).toString();
	}

	return (
		<MainView>
			<TabNavView
				nav={
					<Tabs
						value={0}
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
				<Container maxWidth="sm">
					<Markdown
						markdownContent={decodedReadme}
						emptyText="This repository does not contain a readme."
					/>
				</Container>
			</TabNavView>
		</MainView>
	);
};
