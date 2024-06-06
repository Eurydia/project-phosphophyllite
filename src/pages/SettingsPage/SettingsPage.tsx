import {
	Box,
	Button,
	CircularProgress,
	Stack,
	Typography,
} from "@mui/material";
import { useUpdateCached } from "hooks/useUpdateCached";
import { FC } from "react";
import { useLoaderData } from "react-router";
import {
	normalizeDateString,
	timeSince,
} from "~core/time";
import { LoaderData } from "./loader";

export const SettingsPage: FC = () => {
	const { miscData } =
		useLoaderData() as LoaderData;
	const items = useUpdateCached(miscData);

	const renderedItems = items.map(
		(
			{ label, callback, isBusy, lastUpdated },
			index,
		) => {
			const timeUpdated = normalizeDateString(
				lastUpdated,
				"Unknown",
			);
			const timeSinceUpdated = timeSince(
				lastUpdated,
				"Unknown",
			);
			const lastUpdatedMsg = `Last updated: ${timeUpdated} (${timeSinceUpdated})`;
			const buttonText = isBusy ? (
				<CircularProgress size={24} />
			) : (
				label
			);
			return (
				<Box key={`s-${index}`}>
					<Button
						disableElevation
						disabled={isBusy}
						size="small"
						variant="contained"
						onClick={callback}
					>
						{buttonText}
					</Button>
					<Typography>
						{lastUpdatedMsg}
					</Typography>
				</Box>
			);
		},
	);

	return (
		<Stack
			spacing={2}
			padding={2}
		>
			{renderedItems}
		</Stack>
	);
};
