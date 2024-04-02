export const handleSortChange = (
	sort: string,
	topics: string[],
) => {
	submit(
		{
			sort: value,
			topics: selectedTopics,
		},
		{ action: "/", method: "get" },
	);
};
