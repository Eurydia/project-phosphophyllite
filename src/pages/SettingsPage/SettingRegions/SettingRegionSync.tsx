import {
	Button,
	CircularProgress,
	List,
	ListSubheader,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import { SYNC_DETAILS } from "~constants";
import { WrappableListItem } from "./WrappableListItem";

export const SettingRegionSync: FC = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [syncing, setSyncing] = useState([
		false,
		false,
		false,
	]);

	const enqueueError = (err: any) => {
		enqueueSnackbar({
			message: String(err),
			variant: "error",
		});
		throw err;
	};

	const handleSync = async (index: number) => {
		setSyncing((prev) => {
			const next = [...prev];
			next[index] = true;
			return next;
		});

		const { promise, item } = SYNC_DETAILS[index];
		const res = await promise(enqueueError).catch(
			() => {
				return [false];
			},
		);

		if (res.every((r) => r)) {
			enqueueSnackbar({
				message: `${item} is up to date.`,
				variant: "success",
			});
		}
		setSyncing((prev) => {
			const next = [...prev];
			next[index] = false;
			return next;
		});
	};

	return (
		<List
			disablePadding
			subheader={
				<ListSubheader
					disableGutters
					disableSticky
				>
					Synchronization
				</ListSubheader>
			}
		>
			{SYNC_DETAILS.map(({ item }, index) => (
				<WrappableListItem
					key={item}
					primary={item}
				>
					<Button
						fullWidth
						disableElevation
						disabled={syncing[index]}
						size="small"
						variant="contained"
						onClick={() => handleSync(index)}
					>
						{syncing[index] ? (
							<CircularProgress
								disableShrink
								size={24}
							/>
						) : (
							`Update ${item}`
						)}
					</Button>
				</WrappableListItem>
			))}
		</List>
	);
};
