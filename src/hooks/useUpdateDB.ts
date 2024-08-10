import { useRef } from "react";
import { toast } from "react-toastify";
import { tauriUpdateDB } from "~tauri/db/db";
import { useAnimateToast } from "./useAnimateToast";

export const useUpdateDB = () => {
	const isBusy = useRef(false);

	const [startAnimation, stopAnimation] =
		useAnimateToast();

	const updateDB = async () => {
		if (isBusy.current) {
			toast.warn("Already updating database");
			return;
		}

		isBusy.current = true;

		startAnimation("Updating database");

		await tauriUpdateDB().then(
			() => toast.success("Updated database"),
			(err) => toast.error(err),
		);
		stopAnimation();
		isBusy.current = false;
	};
	return updateDB;
};
