import { useRef, useState } from "react";

export const usePopoverButton = () => {
	const ref = useRef<HTMLButtonElement | null>(
		null,
	);
	const [anchor, setAnchor] =
		useState<HTMLButtonElement | null>(null);

	return [ref, anchor, setAnchor];
};
