import { Grid, TextField } from "@mui/material";

export const FilterComponent = ({ filterText, onFilter, onClear }) => (
	<Grid container item justifyContent="flex-start">
		<TextField
			id="search"
			type="text"
			placeholder="Filter by Customer"
			aria-label="Search Input"
			value={filterText}
			onChange={onFilter}
		/>
	</Grid>
);