import {
	Button,
	CircularProgress,
	List,
	ListSubheader,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import { AdaptiveListItem } from "~components/AdaptiveListItem";
import { SYNC_DETAILS } from "~constants";
import { SettingNavView } from "~views/SettingsNavView";

export const SettingPage: FC = () => {
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
		const res = await promise(enqueueError)
			.then((resp) => resp.every((r) => r))
			.catch(() => {
				return false;
			});
		if (res) {
			enqueueSnackbar({
				message: `${item} data is up to date.`,
				variant: "success",
			});
		}
		setSyncing((prev) => {
			const next = [...prev];
			next[index] = false;
			return next;
		});
	};
	const renderButtonContent = (index: number) => {
		if (syncing[index]) {
			return (
				<CircularProgress
					disableShrink
					size={24}
				/>
			);
		}
		const { item } = SYNC_DETAILS[index];
		return `Update ${item}`;
	};

	return (
		<SettingNavView tab={0}>
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
					<AdaptiveListItem
						key={item}
						text={item}
					>
						<Button
							fullWidth
							disableElevation
							disabled={syncing[index]}
							size="small"
							variant="contained"
							onClick={() => handleSync(index)}
							children={renderButtonContent(
								index,
							)}
						/>
					</AdaptiveListItem>
				))}
			</List>
		</SettingNavView>
	);
};
