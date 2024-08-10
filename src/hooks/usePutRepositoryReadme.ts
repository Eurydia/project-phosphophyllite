import { useRef } from "react";
import { toast } from "react-toastify";
import { tauriPutRepositoryReadme } from "~tauri/github/put";
import { openInEditor } from "~tauri/open";
import { AppRepository } from "~types/models";
import { useAnimateToast } from "./useAnimateToast";

export const usePutRespositoryReadme = () => {
	const [startAnimation, stopAnimation] =
		useAnimateToast();

	const isBusy = useRef(false);

	const putReadme = async (
		repository: AppRepository,
	) => {
		if (isBusy.current) {
			toast.warn(
				"Alreading editing another repository README",
			);
			return;
		}

		isBusy.current = true;

		const initContent = window.atob(
			repository.readme,
		);
		const content = await openInEditor(
			`temp_readme_${repository.owner_login}_${repository.name}.md`,
			initContent,
		).catch((err: string) => {
			toast.error(err);
			return null;
		});

		if (content === null) {
			return;
		}

		startAnimation(
			"Updating repository README...",
		);
		await tauriPutRepositoryReadme(
			repository.owner_login,
			repository.name,
			content,
		).then(
			() => toast.success("Put README"),
			(err) => toast.error(err),
		);

		stopAnimation();
		isBusy.current = false;
	};

	return putReadme;
};
