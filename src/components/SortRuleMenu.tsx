import { CheckRounded } from "@mui/icons-material";
import {
	ListItemIcon,
	ListItemText,
	ListSubheader,
	MenuItem,
	MenuList,
	Paper,
} from "@mui/material";
import { FC } from "react";
import { SortRule } from "~types/generics";

type SortRuleMenuProps = {
	value: string | null;
	options: SortRule<any>[];
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
				<ListSubheader disableSticky>
					Select order
				</ListSubheader>
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
