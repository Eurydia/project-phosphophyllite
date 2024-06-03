import {
	Button,
	CircularProgress,
	Stack,
} from "@mui/material";
import { useSync } from "hooks/useSync";
import { FC } from "react";
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
			return (
				<Button
					key={text}
					fullWidth
					disableElevation
					disabled={syncStates[index]}
					size="small"
					variant="contained"
					onClick={syncFn[index]}
					children={renderButtonContent(index)}
				/>
			);
		},
	);

	return (
		<Stack spacing={2}>{renderedItems}</Stack>
	);
};
