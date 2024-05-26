export const quantityAwareText = (
	amount: number,
	singular: string,
	plural: string,
) => {
	if (amount > 1) {
		return plural;
	}
	return singular;
};
