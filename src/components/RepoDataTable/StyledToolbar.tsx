import { FilterListRounded } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { useRepoQuery } from "hooks/useRepoQuery";
import { useRepoQueryOptions } from "hooks/useRepoQueryOptions";
import { FC, Fragment } from "react";
import {
	Form,
	useSubmit,
} from "react-router-dom";
import { StyledIconButton } from "~components/StyledIconButton";
import { StyledSearchItem } from "~components/StyledSearchItem";
import { StyledSelect } from "~components/StyledSelect";
import { StyledSelectMultiple } from "~components/StyledSelectMultiple";
import { StyledTableToolbar } from "~components/StyledTableToolbar";
import { StyledTextField } from "~components/StyledTextField";
import { SelectOption } from "~types/generic";
import { RepoQuery } from "~types/query";

type StyledToolbarProps = {
	itemCount: number;
	query: RepoQuery;
	topicOptions: SelectOption<string>[];
};
export const StyledToolbar: FC<
	StyledToolbarProps
> = (props) => {
	const { query: initQuery, topicOptions } =
		props;

	const {
		statusOptions,
		topicMatchStrategyOptions,
		visibilityOptions,
	} = useRepoQueryOptions();

	const {
		query,
		setName,
		setStatus,
		setTopicMatchStrategy,
		setTopics,
		setVisibility,
	} = useRepoQuery(initQuery);

	const submit = useSubmit();
	const handleSubmit = () => {
		submit(query, { action: ".", method: "get" });
	};

	const {
		name,
		status,
		topicMatchStrategy,
		topics,
		visibility,
	} = query;

	const renderTopicSelectValue = () =>
		`${topics.length} selected`;

	return (
		<Form onSubmit={handleSubmit}>
			<StyledTableToolbar
				toolbar={
					<Fragment>
						<StyledTextField
							type="text"
							name="name"
							autoComplete="off"
							autoCorrect="off"
							placeholder="Search repository"
							value={name}
							onChange={setName}
						/>
						<StyledIconButton submit>
							<FilterListRounded />
						</StyledIconButton>
					</Fragment>
				}
			>
				<Stack spacing={2}>
					<StyledSearchItem text="Topics">
						<StyledSelectMultiple
							name="topics"
							value={topics}
							options={topicOptions}
							onChange={setTopics}
							renderValue={renderTopicSelectValue}
						/>
					</StyledSearchItem>
					<StyledSearchItem text="Topic match strategy">
						<StyledSelect
							name="topicMatchStrategy"
							value={topicMatchStrategy}
							onChange={setTopicMatchStrategy}
							options={topicMatchStrategyOptions}
						/>
					</StyledSearchItem>
					<StyledSearchItem text="Visibility">
						<StyledSelect
							name="visibility"
							value={visibility}
							onChange={setVisibility}
							options={visibilityOptions}
						/>
					</StyledSearchItem>
					<StyledSearchItem text="Status">
						<StyledSelect
							name="status"
							value={status}
							onChange={setStatus}
							options={statusOptions}
						/>
					</StyledSearchItem>
				</Stack>
			</StyledTableToolbar>
		</Form>
	);
};
