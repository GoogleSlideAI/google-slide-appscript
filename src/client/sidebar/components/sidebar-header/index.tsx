import { Box, Select, MenuItem, Button, FormControl } from "@mui/material";
import { NAV_SCREENS } from "../../constants";
import { serverFunctions } from "../../../utils/serverFunctions";

type SidebarHeaderProps = {
  value: string;
  onValueChange: (value: string) => void;
};

function SidebarHeader(props: SidebarHeaderProps) {
  const { value, onValueChange } = props;

  const handleChange = (event: any) => {
    onValueChange(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "8px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backgroundColor: "white",
      }}
    >
      <FormControl variant="outlined" sx={{ minWidth: 120, flex: 1 }}>
        <Select
          value={value}
          onChange={handleChange}
          sx={{
            color: "gray",
            height: "30px",
          }}
        >
          {NAV_SCREENS.map(({ key, label }) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="outlined"
        startIcon={<span style={{ fontWeight: "bold", fontSize: "16px" }}>+</span>}
        sx={{
          height: "30px",
          textTransform: "none",
        }}
        onClick={ () => serverFunctions.openDialog()}
      >
        New
      </Button>
    </Box>
  );
}

export default SidebarHeader;
