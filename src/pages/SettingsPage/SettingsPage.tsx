import { Button, Stack } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { FC } from "react";

export const SettingsPage: FC = () => {
	// const items = useUpdateCached();

	// const renderedItems = items.map(
	// 	({ label, callback, isBusy }, index) => {
	// 		const buttonText = isBusy
	// 			? "Working"
	// 			: label;
	// 		return (
	// 			<Box key={`s-${index}`}>
	// 				<Button
	// 					disableElevation
	// 					disabled={isBusy}
	// 					size="small"
	// 					variant="contained"
	// 					onClick={callback}
	// 				>
	// 					{buttonText}
	// 				</Button>
	// 			</Box>
	// 		);
	// 	},
	// );

	return (
		<Stack
			spacing={2}
			padding={2}
		>
			<Button onClick={() => invoke("update_db")}>
				Hi
			</Button>
			<Button
				onClick={() =>
					invoke("should_update_db").then((res) =>
						console.log(res),
					)
				}
			>
				Hi
			</Button>
		</Stack>
	);
};
