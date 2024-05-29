import { FilterListRounded } from "@mui/icons-material";
import { useIssueQuery } from "hooks/useIssueQuery";
import { useIssueQueryOptions } from "hooks/useIssueQueryOptions";
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
import { IssueQuery } from "~types/query";

type StyledToolbarProps = {
	query: IssueQuery;
	repoOptions: SelectOption<string>[];
};
export const StyledToolbar: FC<
	StyledToolbarProps
> = (props) => {
	const { query: initQuery, repoOptions } = props;

	const { ownerTypeOptions, stateOptions } =
		useIssueQueryOptions();

	const {
		query,
		setOwnerType,
		setRepoFullNames,
		setState,
		setTitle,
	} = useIssueQuery(initQuery);

	const submit = useSubmit();
	const handleSubmit = () => {
		submit(query, { action: ".", method: "get" });
	};

	const {
		ownerType,
		repoFullNames,
		state,
		title,
	} = query;

	const renderRepoSelectValue = () => {
		return `${repoFullNames.length} selected`;
	};

	return (
		<Form onSubmit={handleSubmit}>
			<StyledTableToolbar
				toolbar={
					<Fragment>
						<StyledTextField
							name="title"
							autoComplete="off"
							autoCorrect="off"
							placeholder="Search issue"
							value={title}
							onChange={setTitle}
						/>
						<StyledIconButton submit>
							<FilterListRounded />
						</StyledIconButton>
					</Fragment>
				}
			>
				<StyledSearchItem text="Repositories">
					<StyledSelectMultiple
						value={repoFullNames}
						options={repoOptions}
						onChange={setRepoFullNames}
						renderValue={renderRepoSelectValue}
					/>
				</StyledSearchItem>
				<StyledSearchItem text="State">
					<StyledSelect
						value={state}
						options={stateOptions}
						onChange={setState}
					/>
				</StyledSearchItem>
				<StyledSearchItem text="Owner type">
					<StyledSelect
						value={ownerType}
						options={ownerTypeOptions}
						onChange={setOwnerType}
					/>
				</StyledSearchItem>
			</StyledTableToolbar>
		</Form>
	);
};
