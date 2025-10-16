import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function AdminPrivateRoutes() {
  const { currentUser } = useSelector((state) => state.user);
  
  return currentUser && currentUser.isAdmin  ? <Outlet /> : <Navigate to={"/signin"} />;
}

export default AdminPrivateRoutes;
