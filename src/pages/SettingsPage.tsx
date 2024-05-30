import {
	Button,
	CircularProgress,
	Stack,
} from "@mui/material";
import { useSync } from "hooks/useSync";
import { FC } from "react";
import { StyledSearchItem } from "~components/StyledSearchItem";
import { SettingNavView } from "~views/SettingsNavView";

export const SettingsPage: FC = () => {
	const { itemText, syncStates, syncFn } =
		useSync();

	const renderButtonContent = (index: number) => {
		if (syncStates[index]) {
			return (
				<CircularProgress
					disableShrink
					size={24}
				/>
			);
		}
		return `Update ${itemText[index]}`;
	};

	const renderedItems = itemText.map(
		(text, index) => {
			const msg = `Update ${text}`;
			return (
				<StyledSearchItem
					key={text}
					text={msg}
				>
					<Button
						fullWidth
						disableElevation
						disabled={syncStates[index]}
						size="small"
						variant="contained"
						onClick={syncFn[index]}
						children={renderButtonContent(index)}
					/>
				</StyledSearchItem>
			);
		},
	);

	return (
		<SettingNavView tab={0}>
			<Stack spacing={2}>{renderedItems}</Stack>
		</SettingNavView>
	);
};
