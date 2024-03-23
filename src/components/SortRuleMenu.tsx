import { CheckRounded } from "@mui/icons-material";
import {
	ListItemIcon,
	ListItemText,
	MenuItem,
	MenuList,
} from "@mui/material";
import { FC } from "react";

type SortRuleMenuProps = {
	rule: string | null;
	sortRules: { label: string; value: string }[];
	onChange: (sortRule: string) => void;
};
export const SortRuleMenu: FC<
	SortRuleMenuProps
> = (props) => {
	const { sortRules, rule, onChange } = props;
	return (
		<MenuList>
			{sortRules.map(
				({ label, value }, index) => (
					<MenuItem
						key={value}
						value={value}
						onClick={() => onChange(value)}
					>
						<ListItemIcon>
							{value === rule && <CheckRounded />}
							{(rule === null || rule === "") &&
								index === 0 && <CheckRounded />}
						</ListItemIcon>
						<ListItemText>{label}</ListItemText>
					</MenuItem>
				),
			)}
		</MenuList>
	);
};
