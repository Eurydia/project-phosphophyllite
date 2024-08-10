import { useRef } from "react";
import { Id, toast } from "react-toastify";

export const useAnimateToast = (): [
	(msg: string) => void,
	() => void,
] => {
	const intervalId = useRef<number | null>(null);
	const toastId = useRef<Id | null>(null);
	const isBusy = useRef(false);
	const dots = useRef(0);

	const animateToast = (msg: string) => {
		if (isBusy.current) {
			return;
		}

		isBusy.current = true;

		toastId.current = toast.info(msg, {
			autoClose: false,
		});

		const id = setInterval(() => {
			dots.current = (dots.current + 1) % 4;
			toast.update(toastId.current as Id, {
				render: msg + ".".repeat(dots.current),
			});
		}, 500);

		intervalId.current = id;
	};

	const stopAnimation = () => {
		if (toastId.current !== null) {
			toast.dismiss(toastId.current);
			toastId.current = null;
		}
		if (intervalId.current !== null) {
			clearInterval(intervalId.current);
			intervalId.current = null;
		}
		isBusy.current = false;
		dots.current = 0;
	};

	return [animateToast, stopAnimation];
};
