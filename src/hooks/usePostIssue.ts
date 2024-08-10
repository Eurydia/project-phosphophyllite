import { useRef } from "react";
import { toast } from "react-toastify";
import { tauriPostIssue } from "~tauri/github/post";
import { openInEditor } from "~tauri/open";
import { AppRepository } from "~types/models";
import { useAnimateToast } from "./useAnimateToast";

export const usePostIssue = () => {
	const [startAnimation, stopAnimation] =
		useAnimateToast();

	const isBusy = useRef(false);

	const postIssue = async (
		repository: AppRepository,
	) => {
		if (isBusy.current) {
			toast.warn("Already adding issue");
			return;
		}

		isBusy.current = true;

		const updatedContent = await openInEditor(
			`temp_issue_${repository.owner_login}_${repository.name}.md`,
			"",
		).catch((err: string) => {
			toast.error(err);
			return null;
		});

		if (updatedContent === null) {
			return;
		}

		startAnimation("Adding issue");

		await tauriPostIssue(
			repository.owner_login,
			repository.name,
			updatedContent,
		).then(
			() => toast.info("Added issue"),
			(err: string) => toast.error(err),
		);

		stopAnimation();
		isBusy.current = false;
	};

	return postIssue;
};
