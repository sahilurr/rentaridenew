import { Box } from "@mui/material";

import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <Box width="100%" padding={"none"} height="100%">
      
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
