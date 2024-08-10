import { useEffect, useRef } from "react";
import { Id, toast } from "react-toastify";
import { postIssue } from "~tauri/github/post";
import { openInEditor } from "~tauri/open";
import { AppRepository } from "~types/models";

const animateToast = (msg: string) => {
	const intervalId = useRef<number | null>(null);
	const toastId = useRef<Id | null>(null);

	toastId.current = toast.info(msg, {
		autoClose: false,
	});

	let dots = useRef(0);
	useEffect(() => {
		if (toastId.current === null) {
			return;
		}

		const id = setInterval(() => {
			dots.current = (dots.current + 1) % 4;
			toast.update(toastId.current as Id, {
				render: msg + ".".repeat(dots.current),
			});
		}, 500);

		intervalId.current = id;

		return () => clearInterval(id);
	}, [msg]);

	const stopAnimation = () => {
		if (toastId.current !== null) {
			toast.dismiss(toastId.current);
		}
		if (intervalId.current !== null) {
			clearInterval(intervalId.current);
		}
	};

	return stopAnimation;
};

export const useAddIssue = () => {
	const addIssue = async (
		repository: AppRepository,
	) => {
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

		const stopAnimation = animateToast(
			"Adding issue",
		);

		await postIssue(
			repository.owner_login,
			repository.name,
			updatedContent,
		).then(
			() => toast.info("Added issue"),
			(err: string) => toast.error(err),
		);

		stopAnimation();
	};

	return addIssue;
};
