import { CheckRounded } from "@mui/icons-material";
import {
	ListItemIcon,
	ListItemText,
	MenuItem,
	MenuList,
	Paper,
} from "@mui/material";
import { FC } from "react";

type SortRuleMenuProps = {
	value: string | null;
	options: { label: string; value: string }[];
	onChange: (sortRule: string) => void;
};
export const SortRuleMenu: FC<
	SortRuleMenuProps
> = (props) => {
	const {
		options,
		value: selected,
		onChange,
	} = props;
	return (
		<Paper square>
			<MenuList>
				{options.map(({ label, value }) => (
					<MenuItem
						key={value}
						value={value}
						onClick={() => onChange(value)}
					>
						<ListItemIcon>
							{value === selected && (
								<CheckRounded />
							)}
						</ListItemIcon>
						<ListItemText>{label}</ListItemText>
					</MenuItem>
				))}
			</MenuList>
		</Paper>
	);
};