import {
	useEffect,
	useRef,
	useState,
} from "react";

export const useElementHeight = () => {
	const elemRef = useRef<HTMLElement | null>(
		null,
	);
	const [height, setHeight] = useState(0);
	useEffect(() => {
		if (elemRef.current === null) {
			return;
		}
		const height =
			elemRef.current.getBoundingClientRect()
				.height;
		setHeight(height);
	}, [elemRef]);
	const elemHeight = `${height}px`;
	return {
		elemRef,
		elemHeight,
	};
};
