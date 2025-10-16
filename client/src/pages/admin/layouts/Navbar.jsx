import {
  DarkModeOutlined,
  LightModeOutlined,
  Menu as MenuIcon,
  Search,
  Settings,
} from "@mui/icons-material";
import FlexBetween from "../../admin/FlexBetween";
import {
  AppBar,
  Button,
  IconButton,
  InputBase,
  Toolbar,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addVehicleClicked } from "../../../redux/adminSlices/actions";

const Navbar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleAddVehicle = () => {
    dispatch(addVehicleClicked(true));
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "primary",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* left side */}
        <FlexBetween>
          <IconButton onClick={() => console.log("clicked")}>
            <MenuIcon />
          </IconButton>
          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="search.." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* right side */}
        <FlexBetween sx={{ gap: "10px" }}>
          <Button
            sx={{ marginRight: "10px", color: "white", bgcolor: "errro.main" }}
            onClick={handleAddVehicle}
          >
            + Add
          </Button>
          <IconButton>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <Settings />
          </IconButton>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
